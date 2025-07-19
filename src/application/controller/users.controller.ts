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
  BadRequestException,
  UnauthorizedException,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

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
  ApiProperty,
  ApiConsumes,
} from '@nestjs/swagger';

import { CreateUserResonseSchema } from './documentation/user/ResponseSchema/CreateUserResponseSchema';
import { GetUserUseCase } from 'src/core/domain/user/service/GetUserUsecase';
import { GetUserResonseSchema } from './documentation/user/ResponseSchema/GetUserResponseSchema';
import { CreateUserSchema } from './documentation/user/RequsetSchema/CreateUserRequestSchema';
import {
  UserFilter,
  UserSortBy,
  SortOrder,
} from '@src/core/domain/user/dto/UserFilter';
import { GetUserListWithFilterUseCase } from '@src/core/domain/user/service/GetUserListUsecase';
import { UserFilterSchama } from './documentation/user/RequsetSchema/UserFilterSchema';
import { GetUserListResponseSchema } from './documentation/user/ResponseSchema/GetUserListResponseSchema';
import { BaseRequestQuerySchema } from './documentation/common/BaseRequestQuerySchema';
import { UpdateUserRequestSchema } from './documentation/user/RequsetSchema/UpdateUserRequestSchema';
import { UpdateUserUseCase } from '@src/core/domain/user/service/UpdateUserUseCase';
import { UserRole } from '@src/core/common/type/UserEnum';
import { PrismaService } from '@src/core/common/prisma/PrismaService';
import { UpdateProfileUseCase } from '@src/core/domain/user/service/UpdateProfileUseCase';
import { UpdateProfileRequestSchema } from './documentation/user/RequsetSchema/UpdateProfileRequestSchema';
import { DeleteUserUseCase } from '@src/core/domain/user/service/DeleteUserUseCase';
import { LocalFileUploadService } from '@src/core/common/file-upload/LocalFileUploadService';

@Controller('User')
@ApiTags('users')
export class UsersController {
  constructor(
    // @Inject()
    private getUserUseCase: GetUserUseCase,
    private createUserUseCase: CreateUserUseCase,
    private getUserListWithFilter: GetUserListWithFilterUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private updateProfileUseCase: UpdateProfileUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private prisma: PrismaService,
    private localFileUploadService: LocalFileUploadService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiResponse({ type: GetUserResonseSchema })
  @Get()
  async findOne(@Request() req): Promise<CoreApiResonseSchema<any>> {
    try {
      return CoreApiResonseSchema.success(
        await this.getUserUseCase.execute(req.user?.user?.id),
      );
    } catch (error) {
      throw new ForbiddenException('Error retrieving user data');
    }
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
          'Access denied. Only administrators can view user details.',
        );
      }

      return CoreApiResonseSchema.success(
        await this.getUserUseCase.execute(params.id),
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
        params.email,
        params.phone,
        params.sortBy,
        params.sortOrder,
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
    @Request() req,
  ): Promise<CoreApiResonseSchema<any>> {
    try {
      // Get user ID from token
      const userId = req.user?.user?.id;

      // Query database to get user's role
      const currentUser = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { role: true },
      });

      // Check if user exists and is an admin (or is updating their own data)
      if (!currentUser) {
        throw new ForbiddenException('User not found');
      }

      if (currentUser.role !== UserRole.ADMIN && userId !== params.id) {
        throw new ForbiddenException(
          'Access denied. Only administrators can update other users.',
        );
      }

      const updateUserDto = new CreateUserDto();
      updateUserDto.id = params.id;
      updateUserDto.email = user.email;
      updateUserDto.phone = user.phone;
      updateUserDto.name = user.name;
      updateUserDto.role = user.role;

      return CoreApiResonseSchema.success(
        await this.updateUserUseCase.execute(updateUserDto),
      );
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Error updating user');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put('profile')
  @ApiBody({ type: UpdateProfileRequestSchema })
  @ApiResponse({ type: CreateUserResonseSchema })
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body(
      new ValidationPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    profileData: UpdateProfileRequestSchema,
    @Request() req,
  ): Promise<CoreApiResonseSchema<any>> {
    try {
      // Get current user ID from token
      const userId = req.user?.user?.id;
      if (!userId) {
        throw new ForbiddenException('Authentication required');
      }

      // Execute the update profile use case
      const updatedUser = await this.updateProfileUseCase.execute(
        userId,
        profileData,
      );

      // Convert to DTO for response
      const responseDto = CreateUserDto.convertToClass(updatedUser);

      return CoreApiResonseSchema.success(responseDto);
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('Error updating profile: ' + error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiResponse({ description: 'User deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') id: string,
    @Request() req,
  ): Promise<CoreApiResonseSchema<any>> {
    try {
      // Get admin user ID from token
      const adminUserId = req.user?.user?.id;
      if (!adminUserId) {
        throw new ForbiddenException('Authentication required');
      }

      // Execute the delete user use case
      const result = await this.deleteUserUseCase.execute(adminUserId, id);

      return CoreApiResonseSchema.success({
        message: 'User deleted successfully',
        success: result,
      });
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('Error deleting user: ' + error.message);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile image upload',
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    description: 'Profile image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            profileImageUrl: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async uploadProfileImage(
    @UploadedFile() file: any,
    @Request() req,
  ): Promise<CoreApiResonseSchema<any>> {
    try {
      // Get user ID from token
      const userId = req.user?.user?.id;
      if (!userId) {
        throw new ForbiddenException('Authentication required');
      }

      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // Upload the file
      const profileImageUrl =
        await this.localFileUploadService.uploadProfileImage(file);

      // Get current user to delete old image if exists
      const currentUser = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { profileImageUrl: true },
      });

      // Delete old image if exists
      if (currentUser?.profileImageUrl) {
        await this.localFileUploadService.deleteProfileImage(
          currentUser.profileImageUrl,
        );
      }

      // Update user's profile image URL in database
      await this.prisma.user.update({
        where: { id: Number(userId) },
        data: { profileImageUrl },
      });

      return CoreApiResonseSchema.success({
        profileImageUrl,
        message: 'Profile image uploaded successfully',
      });
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Error uploading profile image: ' + error.message,
      );
    }
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
