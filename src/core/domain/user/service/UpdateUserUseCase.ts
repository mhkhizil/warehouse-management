import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { ICreateUserUseCase } from '../port/service-port/ICreateUserUseCase';
import { UserEntity } from '../entity/User';
import { CreateUserDto } from '../dto/CreateUserDto';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { hash } from 'argon2';

@Injectable()
export class UpdateUserUseCase implements ICreateUserUseCase {
  constructor(@Inject() private readonly userRepository: IUserRepository) {}
  public async execute(data?: CreateUserDto): Promise<any> {
    // Get the current user to compare values
    const currentUser = await this.userRepository.find({ id: data?.id });
    if (!currentUser) {
      throw new BadRequestException('User not found');
    }

    // Check if phone is being updated and if it already exists
    if (data?.phone && data.phone !== currentUser.phone) {
      const existingUserWithPhone = await this.userRepository.find({
        phone: data.phone,
      });
      if (existingUserWithPhone && existingUserWithPhone.id !== data.id) {
        throw new BadRequestException(
          'Phone number already in use by another user',
        );
      }
    }

    // Check if email is being updated and if it already exists
    if (data?.email && data.email !== currentUser.email) {
      const existingUserWithEmail = await this.userRepository.find({
        email: data.email,
      });
      if (existingUserWithEmail && existingUserWithEmail.id !== data.id) {
        throw new BadRequestException('Email already in use by another user');
      }
    }

    const newUser = new UserEntity(
      data?.id,
      data?.name,
      data?.email,
      data?.phone,
      data?.role,
    );
    const createdUser = await this.userRepository.update(newUser);

    return createdUser;
  }
}
