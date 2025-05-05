import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { PrismaService } from '@src/core/common/prisma/PrismaService';
import { IDeleteUserUseCase } from '../port/service-port/IDeleteUserUseCase';
import { UserRole } from '@src/core/common/type/UserEnum';

@Injectable()
export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(
    @Inject() private readonly userRepository: IUserRepository,
    @Inject() private readonly prisma: PrismaService,
  ) {}

  public async execute(
    adminUserId: string,
    userIdToDelete: string,
  ): Promise<boolean> {
    // Verify the admin user exists and is an admin
    const adminUser = await this.prisma.user.findUnique({
      where: { id: Number(adminUserId) },
      select: {
        id: true,
        role: true,
      },
    });

    if (!adminUser) {
      throw new NotFoundException('Admin user not found');
    }

    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only administrators can delete users');
    }

    // Don't allow admins to delete themselves
    if (adminUserId === userIdToDelete) {
      throw new BadRequestException(
        'Administrators cannot delete their own accounts',
      );
    }

    // Verify the user to delete exists
    const userToDelete = await this.prisma.user.findUnique({
      where: { id: Number(userIdToDelete) },
    });

    if (!userToDelete) {
      throw new NotFoundException(`User with ID ${userIdToDelete} not found`);
    }

    // Delete the user
    try {
      // Check if there are any related records in Staff
      const staffRecord = await this.prisma.staff.findUnique({
        where: { userId: Number(userIdToDelete) },
      });

      // If staff record exists, delete it first
      if (staffRecord) {
        await this.prisma.staff.delete({
          where: { userId: Number(userIdToDelete) },
        });
      }

      // Now delete the user
      await this.prisma.user.delete({
        where: { id: Number(userIdToDelete) },
      });

      return true;
    } catch (error) {
      throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }
  }
}
