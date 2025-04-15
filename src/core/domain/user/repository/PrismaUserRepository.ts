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
      const result = await this.prisma.user.create({
        data: {
          username: user.name,
          email: user.email,
          password: user.password,
          role: user.role as unknown as Role,
          remarks: null,
        },
      });
      return UserEntity.toEntity(result);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          // throw new BadRequestException(
          //   CoreApiResonseSchema.error(
          //     HttpStatus.BAD_REQUEST,
          //     'Bad Request',
          //     e?.meta?.target[0] == 'email'
          //       ? 'Email already used'
          //       : 'Phone already used',
          //   ),
          // );
          throw new BadRequestException({
            message: 'Bad request',
            error:
              e?.meta?.target[0] == 'email'
                ? 'Email already used'
                : 'Phone already used',
          });
        } else {
          throw new BadRequestException({
            message: 'Bad request',
            error: '',
          });
        }
      } else if (e instanceof PrismaClientValidationError) {
        throw new InternalServerErrorException({
          message: 'Internal server error',
          error: '',
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
          password: userData.password,
          role: userData.role as unknown as Role,
          updatedAt: new Date(),
        },
      });
      return UserEntity.toEntity(result);
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

      if (filter.name) where.username = { contains: filter.name };
      if (filter.role) where.role = filter.role as unknown as Role;

      const totalCounts = await this.prisma.user.count({
        where,
      });

      const users = await this.prisma.user.findMany({
        where,
        take: filter.take,
        skip: filter.skip,
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
