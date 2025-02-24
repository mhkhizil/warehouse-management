import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { SinginUserDto } from 'src/core/domain/auth/dto/SigninUserDto';
import { AuthService } from 'src/core/domain/auth/service/Authservice';

import { LocalGuard } from '../auth/guard/local.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequestSchema } from './documentation/auth/RequestSchema/AuthRequestSchema';
import { AuthResponseSchema } from './documentation/auth/ResponseSchema/AuthResponseSchema';
import { CoreApiResonseSchema } from 'src/core/common/schema/ApiResponseSchema';
import { CreateUserSchema } from './documentation/user/RequsetSchema/CreateUserRequestSchema';
import { CreateUserResonseSchema } from './documentation/user/ResponseSchema/CreateUserResponseSchema';
import { CreateUserUseCase } from 'src/core/domain/user/service/CreateUserUsecase';
import { PrismaUserRepository } from 'src/core/domain/user/repository/PrismaUserRepository';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from 'src/core/domain/user/dto/CreateUserDto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject() private authService: AuthService,
    private createUserUseCase: CreateUserUseCase,
  ) {}

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: AuthRequestSchema })
  @ApiResponse({ type: AuthResponseSchema })
  @HttpCode(HttpStatus.OK)
  async SignIn(
    @Body(
      new ValidationPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    credential: AuthRequestSchema,
  ): Promise<CoreApiResonseSchema<any>> {
    const result = await this.authService.validateUser(credential);
    return CoreApiResonseSchema.success({ token: result });
  }

  @Post('register')
  @ApiBody({ type: CreateUserSchema })
  @ApiResponse({ type: CreateUserResonseSchema })
  @HttpCode(HttpStatus.OK)
  async Login(
    @Body(
      new ValidationPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    user: CreateUserSchema,
  ): Promise<CoreApiResonseSchema<any>> {
    const createUserDto = new CreateUserDto();
    createUserDto.email = user.email;
    createUserDto.phone = user.phone;
    createUserDto.name = user.name;
    createUserDto.password = user.password;
    createUserDto.role = user.role;
    return CoreApiResonseSchema.success(
      await this.createUserUseCase.execute(createUserDto),
    );
  }
}
