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

export class PrismaUserRepository implements IUserRepository {
  constructor(@Inject() public readonly prisma: PrismaService) {}

  async create(user: UserEntity): Promise<UserEntity> {
    try {
      const result = await this.prisma.user.create({
        data: {
          phone: user.phone,
          email: user.email,
          name: user.name,
          password: user.password,
          role: user.role,
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
      const result = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          ...user,
          updatedDate: new Date(),
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
        where: { id: id },
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
      const user = await this.prisma.user.findFirst({
        where: {
          ...by,
        },
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
      const totalCounts = await this.prisma.user.count({
        where: {
          name: { contains: filter.name },
          role: { contains: filter.role },
        },
      });
      const users = await this.prisma.user.findMany({
        where: {
          name: { contains: filter.name },
          role: { contains: filter.role },
        },
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
