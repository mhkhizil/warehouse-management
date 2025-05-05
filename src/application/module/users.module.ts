import { Module } from '@nestjs/common';
import { UsersController } from '../controller/users.controller';

import { CreateUserUseCase } from 'src/core/domain/user/service/CreateUserUsecase';

import { IUserRepository } from 'src/core/domain/user/port/repository-port/IUserRepositoryPort';
import { PrismaUserRepository } from 'src/core/domain/user/repository/PrismaUserRepository';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AuthModule } from './auth.module';
import { AuthService } from 'src/core/domain/auth/service/Authservice';
import { GetUserUseCase } from 'src/core/domain/user/service/GetUserUsecase';
import { GetUserListWithFilterUseCase } from '@src/core/domain/user/service/GetUserListUsecase';
import { UpdateUserUseCase } from '@src/core/domain/user/service/UpdateUserUseCase';
import { PrismaService } from '@src/core/common/prisma/PrismaService';
import { UpdateProfileUseCase } from '@src/core/domain/user/service/UpdateProfileUseCase';
import { DeleteUserUseCase } from '@src/core/domain/user/service/DeleteUserUseCase';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    JwtGuard,
    GetUserUseCase,
    GetUserListWithFilterUseCase,
    UpdateUserUseCase,
    UpdateProfileUseCase,
    DeleteUserUseCase,
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UsersModule {}
