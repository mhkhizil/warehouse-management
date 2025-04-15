import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name);

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);

    // Check if user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if trying to update email and it's already used by another user
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUserWithEmail = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUserWithEmail && existingUserWithEmail.id !== id) {
        this.logger.warn(
          `Email ${updateUserDto.email} already in use by another user`,
        );
        throw new BadRequestException('Email already in use by another user');
      }
    }

    // Check if trying to update username and it's already used by another user
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUserWithUsername = await this.userRepository.findByUsername(
        updateUserDto.username,
      );
      if (existingUserWithUsername && existingUserWithUsername.id !== id) {
        this.logger.warn(
          `Username ${updateUserDto.username} already in use by another user`,
        );
        throw new BadRequestException(
          'Username already in use by another user',
        );
      }
    }

    // Handle password update if provided
    let dataToUpdate: Partial<User> & { currentPassword?: string } = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      // If current password is provided, verify it
      if (updateUserDto.currentPassword) {
        const isPasswordValid = await argon2.verify(
          user.password,
          updateUserDto.currentPassword,
        );
        if (!isPasswordValid) {
          this.logger.warn('Current password is incorrect');
          throw new UnauthorizedException('Current password is incorrect');
        }
      }

      // Hash the new password
      dataToUpdate.password = await argon2.hash(updateUserDto.password);
    }

    // Remove currentPassword from the data to update as it's not a field in the DB
    delete dataToUpdate.currentPassword;

    // Update user
    const updatedUser = await this.userRepository.update(id, dataToUpdate);
    this.logger.log(`User with ID ${id} updated successfully`);

    return updatedUser;
  }
}
