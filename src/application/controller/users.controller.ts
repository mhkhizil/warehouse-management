import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';

import { CreateUserUseCase } from 'src/core/domain/user/service/CreateUserUsecase';
import { CreateUserDto } from 'src/core/domain/user/dto/CreateUserDto';

import { PrismaUserRepository } from 'src/core/domain/user/repository/PrismaUserRepository';
import { PrismaClient } from '@prisma/client';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CoreApiResonseSchema } from 'src/core/common/schema/ApiResponseSchema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserResonseSchema } from './documentation/user/ResponseSchema/CreateUserResponseSchema';
import { GetUserUseCase } from 'src/core/domain/user/service/GetUserUsecase';
import { GetUserResonseSchema } from './documentation/user/ResponseSchema/GetUserResponseSchema';
import { CreateUserSchema } from './documentation/user/RequsetSchema/CreateUserRequestSchema';
import { UserFilter } from '@src/core/domain/user/dto/UserFilter';
import { GetUserListWithFilterUseCase } from '@src/core/domain/user/service/GetUserListUsecase';
import { UserFilterSchama } from './documentation/user/RequsetSchema/UserFilterSchema';
import { GetUserListResponseSchema } from './documentation/user/ResponseSchema/GetUserListResponseSchema';
import { BaseRequestQuerySchema } from './documentation/common/BaseRequestQuerySchema';
import { UpdateUserRequestSchema } from './documentation/user/RequsetSchema/UpdateUserRequestSchema';
import { UpdateUserUseCase } from '@src/core/domain/user/service/UpdateUserUseCase';
import { UserRole } from '@src/core/common/type/UserEnum';
import { PrismaService } from '@src/core/common/prisma/PrismaService';

@Controller('User')
@ApiTags('users')
export class UsersController {
  constructor(
    // @Inject()
    private getUserUseCase: GetUserUseCase,
    private createUserUseCase: CreateUserUseCase,
    private getUserListWithFilter: GetUserListWithFilterUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private prisma: PrismaService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ type: GetUserResonseSchema })
  @Get()
  async findOne(@Request() req): Promise<CoreApiResonseSchema<any>> {
    return CoreApiResonseSchema.success(
      await this.getUserUseCase.execute(req.user?.user?.id),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiQuery({ type: BaseRequestQuerySchema })
  @ApiResponse({ type: GetUserResonseSchema })
  @Get('/getUserById')
  async findOneById(
    @Request() req,
    @Query() params: { id: string },
  ): Promise<CoreApiResonseSchema<any>> {
    return CoreApiResonseSchema.success(
      await this.getUserUseCase.execute(params.id),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ type: GetUserListResponseSchema })
  @Get('/getUserList')
  public async getAllByFilter(
    @Query() params: UserFilterSchama,
    @Request() req,
  ) {
    try {
      // Get user ID from token
      const userId = req.user?.user?.id;

      // Query database to get user's role
      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { role: true },
      });

      // Check if user exists and is an admin
      if (!user || user.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Access denied. Only administrators can view user list.',
        );
      }

      const filter = new UserFilter(
        params.name,
        params.role,
        parseInt(params?.take.toString()),
        parseInt(params?.skip.toString()),
      );

      return CoreApiResonseSchema.success(
        await this.getUserListWithFilter.execute(filter),
      );
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Error checking user permissions');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put('update')
  @ApiBody({ type: UpdateUserRequestSchema })
  @ApiResponse({ type: CreateUserResonseSchema })
  @ApiQuery({ type: BaseRequestQuerySchema })
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Body(
      new ValidationPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    user: UpdateUserRequestSchema,
    @Query() params: { id: string },
  ): Promise<CoreApiResonseSchema<any>> {
    const updateUserDto = new CreateUserDto();
    updateUserDto.id = params.id;
    updateUserDto.email = user.email;
    updateUserDto.phone = user.phone;
    updateUserDto.name = user.name;

    updateUserDto.role = user.role;
    return CoreApiResonseSchema.success(
      await this.updateUserUseCase.execute(updateUserDto),
    );
  }

  // @Post()
  // @ApiBody({ type: CreateUserSchema })
  // @ApiResponse({ type: CreateUserResonseSchema })
  // @HttpCode(HttpStatus.OK)
  // public async create(
  //   @Body(
  //     new ValidationPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
  //   )
  //   user: CreateUserSchema,
  // ): Promise<CoreApiResonseSchema<any>> {
  //   this.createUserUseCase = new CreateUserUseCase(
  //     new PrismaUserRepository(new PrismaClient()),
  //   );
  //   const createUserDto = new CreateUserDto();
  //   createUserDto.email = user.email;
  //   createUserDto.name = user.name;
  //   createUserDto.password = user.password;
  //   createUserDto.role = user.role;

  //   return CoreApiResonseSchema.success(
  //     await this.createUserUseCase.execute(createUserDto),
  //   );
  // }
}
