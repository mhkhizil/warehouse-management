import { PrismaClient } from '@prisma/client';
import { UserEntity } from '../entity/User';
import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { CoreApiResonseSchema } from 'src/core/common/schema/ApiResponseSchema';
import { UserFilter } from '../dto/UserFilter';
import { PrismaService } from '@src/core/common/prisma/PrismaService';
import { Role } from '../entity/Role';

export class PrismaUserRepository implements IUserRepository {
  constructor(@Inject() public readonly prisma: PrismaService) {}

  async create(user: UserEntity): Promise<UserEntity> {
    try {
      console.log('this is the user from repository', user);
      const result = await this.prisma.user.create({
        data: {
          username: user.name,
          email: user.email,
          phone: user.phone,
          password: user.password,
          role: user.role as unknown as Role,
          remarks: null,
        },
      });
      return UserEntity.toEntity(result);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        console.log('this is the error from repository', e);
        if (e.code == 'P2002') {
          const targetField = e?.meta?.target?.[0];
          let errorMessage = 'Field already exists';

          if (targetField === 'username') {
            errorMessage = 'Username already exists';
          } else if (targetField === 'email') {
            errorMessage = 'Email already exists';
          } else if (targetField === 'phone') {
            errorMessage = 'Phone already exists';
          }

          throw new BadRequestException({
            message: 'Bad request',
            error: errorMessage,
          });
        } else {
          throw new BadRequestException({
            message: 'Bad request',
            error: 'User creation failed',
          });
        }
      } else if (e instanceof PrismaClientValidationError) {
        throw new InternalServerErrorException({
          message: 'Internal server error',
          error: 'Validation error',
        });
      } else {
        throw new BadRequestException('Internal server error', {
          cause: new Error(),
          description: 'Cannot create user',
        });
      }
    }
  }
  async update(user: UserEntity): Promise<UserEntity> {
    try {
      const { id, ...userData } = user;

      const result = await this.prisma.user.update({
        where: { id: Number(id) },
        data: {
          username: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          role: userData.role as unknown as Role,
          updatedAt: new Date(),
        },
      });
      return UserEntity.toEntity(result);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const targetField = e?.meta?.target?.[0];
          let errorMessage = 'Field already exists';

          if (targetField === 'username') {
            errorMessage = 'Username already exists';
          } else if (targetField === 'email') {
            errorMessage = 'Email already exists';
          } else if (targetField === 'phone') {
            errorMessage = 'Phone already exists';
          }

          throw new BadRequestException({
            message: 'Bad request',
            error: errorMessage,
          });
        } else {
          throw new BadRequestException({
            message: 'Bad request',
            error: 'User update failed',
          });
        }
      } else if (e instanceof PrismaClientValidationError) {
        throw new InternalServerErrorException({
          message: 'Internal server error',
          error: 'Validation error',
        });
      } else {
        throw new InternalServerErrorException({
          message: 'Internal server error',
          error: 'User update failed',
        });
      }
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new InternalServerErrorException({
          message: 'Internal server error',
          error: '',
        });
      }
      if (e instanceof PrismaClientKnownRequestError) {
        throw new InternalServerErrorException({
          message: 'Internal server error',
          error: '',
        });
      }
    }
  }
  async find(by: {
    id?: string;
    email?: string;
    name?: string;
    phone?: string;
  }): Promise<UserEntity | null> {
    try {
      const where: any = {};

      if (by.id) where.id = Number(by.id);
      if (by.email) where.email = by.email;
      if (by.name) where.name = by.name;
      if (by.phone) where.phone = by.phone;

      const user = await this.prisma.user.findFirst({
        where,
      });

      if (user) return UserEntity.toEntity(user);
      else return null;
    } catch (e) {
      if (e instanceof PrismaClientValidationError) {
        throw new InternalServerErrorException({
          message: 'Internal server error',
          error: '',
        });
      }
      if (e instanceof PrismaClientKnownRequestError) {
        throw new InternalServerErrorException({
          message: 'Internal server error',
          error: '',
        });
      }
    }
  }
  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({});

    return users.map((user) => UserEntity.toEntity(user));
  }

  async findAllWithSchema(
    filter: UserFilter,
  ): Promise<{ users: UserEntity[]; totalCounts: number }> {
    try {
      const where: any = {};

      if (filter.name)
        where.username = { contains: filter.name, mode: 'insensitive' };
      if (filter.email)
        where.email = { contains: filter.email, mode: 'insensitive' };
      if (filter.phone) where.phone = { contains: filter.phone };
      if (filter.role) where.role = filter.role as unknown as Role;

      // Build order by clause
      const orderBy: any = {};
      const sortField = filter.sortBy || 'createdAt';
      const sortOrder = filter.sortOrder || 'desc';

      // Map UserSortBy enum values to Prisma field names
      const fieldMapping = {
        name: 'username',
        email: 'email',
        phone: 'phone',
        role: 'role',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      };

      const prismaFieldName = fieldMapping[sortField] || 'createdAt';
      orderBy[prismaFieldName] = sortOrder;

      const totalCounts = await this.prisma.user.count({
        where,
      });

      const users = await this.prisma.user.findMany({
        where,
        take: filter.take,
        skip: filter.skip,
        orderBy: orderBy,
      });

      return {
        users: users.map((product) => UserEntity.toEntity(product)),
        totalCounts: totalCounts,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        message: 'Internal server error',
        error: '',
      });
    }
  }
}
