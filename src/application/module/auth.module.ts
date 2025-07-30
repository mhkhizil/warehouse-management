import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from 'src/core/domain/auth/service/Authservice';
import { JwtModule } from '@nestjs/jwt';
import { IUserRepository } from 'src/core/domain/user/port/repository-port/IUserRepositoryPort';
import { PrismaUserRepository } from 'src/core/domain/user/repository/PrismaUserRepository';
import { LocalStrategy } from '../auth/passport/local.strategy';
import { UsersModule } from './users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/passport/jwt.strategy';
import { env } from 'process';
import { CreateUserUseCase } from 'src/core/domain/user/service/CreateUserUsecase';
import { AdminGuard } from '../auth/guard/admin.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: env.JWT_EXPIRES_IN || '24h', // Default to 24 hours if not set
      },
    }),
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    LocalStrategy,
    JwtStrategy,
    CreateUserUseCase,
    AdminGuard,
  ],
})
export class AuthModule {}
