import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { UserEntity } from '../entity/User';
import { UpdateProfileDto } from '../dto/UpdateProfileDto';
import * as argon2 from 'argon2';
import { PrismaService } from '@src/core/common/prisma/PrismaService';
import { IUpdateProfileUseCase } from '../port/service-port/IUpdateProfileUseCase';

@Injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(
    @Inject() private readonly userRepository: IUserRepository,
    @Inject() private readonly prisma: PrismaService,
  ) {}

  public async execute(
    userId: string,
    data: UpdateProfileDto,
  ): Promise<UserEntity> {
    // Get user data from DB
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        username: true,
        password: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const updateData: any = {};

    // Update name if provided
    if (data.name) {
      updateData.username = data.name;
    }

    // Update password if provided
    if (data.currentPassword && data.newPassword) {
      // Verify the current password using argon2
      const isPasswordValid = await argon2.verify(
        user.password,
        data.currentPassword,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Hash the new password with argon2
      updateData.password = await argon2.hash(data.newPassword);
    }

    // Only proceed if there are fields to update
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No valid fields to update');
    }

    // Update the user
    const updatedUser = await this.prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
    });

    // Return the updated user entity
    return UserEntity.toEntity(updatedUser);
  }
}
