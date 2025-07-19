"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const CreateUserUsecase_1 = require("../../core/domain/user/service/CreateUserUsecase");
const CreateUserDto_1 = require("../../core/domain/user/dto/CreateUserDto");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const ApiResponseSchema_1 = require("../../core/common/schema/ApiResponseSchema");
const swagger_1 = require("@nestjs/swagger");
const CreateUserResponseSchema_1 = require("./documentation/user/ResponseSchema/CreateUserResponseSchema");
const GetUserUsecase_1 = require("../../core/domain/user/service/GetUserUsecase");
const GetUserResponseSchema_1 = require("./documentation/user/ResponseSchema/GetUserResponseSchema");
const UserFilter_1 = require("../../core/domain/user/dto/UserFilter");
const GetUserListUsecase_1 = require("../../core/domain/user/service/GetUserListUsecase");
const UserFilterSchema_1 = require("./documentation/user/RequsetSchema/UserFilterSchema");
const GetUserListResponseSchema_1 = require("./documentation/user/ResponseSchema/GetUserListResponseSchema");
const BaseRequestQuerySchema_1 = require("./documentation/common/BaseRequestQuerySchema");
const UpdateUserRequestSchema_1 = require("./documentation/user/RequsetSchema/UpdateUserRequestSchema");
const UpdateUserUseCase_1 = require("../../core/domain/user/service/UpdateUserUseCase");
const UserEnum_1 = require("../../core/common/type/UserEnum");
const PrismaService_1 = require("../../core/common/prisma/PrismaService");
const UpdateProfileUseCase_1 = require("../../core/domain/user/service/UpdateProfileUseCase");
const UpdateProfileRequestSchema_1 = require("./documentation/user/RequsetSchema/UpdateProfileRequestSchema");
const DeleteUserUseCase_1 = require("../../core/domain/user/service/DeleteUserUseCase");
const LocalFileUploadService_1 = require("../../core/common/file-upload/LocalFileUploadService");
let UsersController = class UsersController {
    constructor(getUserUseCase, createUserUseCase, getUserListWithFilter, updateUserUseCase, updateProfileUseCase, deleteUserUseCase, prisma, localFileUploadService) {
        this.getUserUseCase = getUserUseCase;
        this.createUserUseCase = createUserUseCase;
        this.getUserListWithFilter = getUserListWithFilter;
        this.updateUserUseCase = updateUserUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.prisma = prisma;
        this.localFileUploadService = localFileUploadService;
    }
    async findOne(req) {
        try {
            return ApiResponseSchema_1.CoreApiResonseSchema.success(await this.getUserUseCase.execute(req.user?.user?.id));
        }
        catch (error) {
            throw new common_1.ForbiddenException('Error retrieving user data');
        }
    }
    async findOneById(req, params) {
        try {
            const userId = req.user?.user?.id;
            const user = await this.prisma.user.findUnique({
                where: { id: Number(userId) },
                select: { role: true },
            });
            if (!user || user.role !== UserEnum_1.UserRole.ADMIN) {
                throw new common_1.ForbiddenException('Access denied. Only administrators can view user details.');
            }
            return ApiResponseSchema_1.CoreApiResonseSchema.success(await this.getUserUseCase.execute(params.id));
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.ForbiddenException('Error checking user permissions');
        }
    }
    async getAllByFilter(params, req) {
        try {
            const userId = req.user?.user?.id;
            const user = await this.prisma.user.findUnique({
                where: { id: Number(userId) },
                select: { role: true },
            });
            if (!user || user.role !== UserEnum_1.UserRole.ADMIN) {
                throw new common_1.ForbiddenException('Access denied. Only administrators can view user list.');
            }
            const filter = new UserFilter_1.UserFilter(params.name, params.role, params.email, params.phone, params.sortBy, params.sortOrder, parseInt(params?.take.toString()), parseInt(params?.skip.toString()));
            return ApiResponseSchema_1.CoreApiResonseSchema.success(await this.getUserListWithFilter.execute(filter));
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.ForbiddenException('Error checking user permissions');
        }
    }
    async updateUser(user, params, req) {
        try {
            const userId = req.user?.user?.id;
            const currentUser = await this.prisma.user.findUnique({
                where: { id: Number(userId) },
                select: { role: true },
            });
            if (!currentUser) {
                throw new common_1.ForbiddenException('User not found');
            }
            if (currentUser.role !== UserEnum_1.UserRole.ADMIN && userId !== params.id) {
                throw new common_1.ForbiddenException('Access denied. Only administrators can update other users.');
            }
            const updateUserDto = new CreateUserDto_1.CreateUserDto();
            updateUserDto.id = params.id;
            updateUserDto.email = user.email;
            updateUserDto.phone = user.phone;
            updateUserDto.name = user.name;
            updateUserDto.role = user.role;
            return ApiResponseSchema_1.CoreApiResonseSchema.success(await this.updateUserUseCase.execute(updateUserDto));
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.ForbiddenException('Error updating user');
        }
    }
    async updateProfile(profileData, req) {
        try {
            const userId = req.user?.user?.id;
            if (!userId) {
                throw new common_1.ForbiddenException('Authentication required');
            }
            const updatedUser = await this.updateProfileUseCase.execute(userId, profileData);
            const responseDto = CreateUserDto_1.CreateUserDto.convertToClass(updatedUser);
            return ApiResponseSchema_1.CoreApiResonseSchema.success(responseDto);
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error updating profile: ' + error.message);
        }
    }
    async deleteUser(id, req) {
        try {
            const adminUserId = req.user?.user?.id;
            if (!adminUserId) {
                throw new common_1.ForbiddenException('Authentication required');
            }
            const result = await this.deleteUserUseCase.execute(adminUserId, id);
            return ApiResponseSchema_1.CoreApiResonseSchema.success({
                message: 'User deleted successfully',
                success: result,
            });
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error deleting user: ' + error.message);
        }
    }
    async uploadProfileImage(file, req) {
        try {
            const userId = req.user?.user?.id;
            if (!userId) {
                throw new common_1.ForbiddenException('Authentication required');
            }
            if (!file) {
                throw new common_1.BadRequestException('No file uploaded');
            }
            const profileImageUrl = await this.localFileUploadService.uploadProfileImage(file);
            const currentUser = await this.prisma.user.findUnique({
                where: { id: Number(userId) },
                select: { profileImageUrl: true },
            });
            if (currentUser?.profileImageUrl) {
                await this.localFileUploadService.deleteProfileImage(currentUser.profileImageUrl);
            }
            await this.prisma.user.update({
                where: { id: Number(userId) },
                data: { profileImageUrl },
            });
            return ApiResponseSchema_1.CoreApiResonseSchema.success({
                profileImageUrl,
                message: 'Profile image uploaded successfully',
            });
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.BadRequestException('Error uploading profile image: ' + error.message);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiResponse)({ type: GetUserResponseSchema_1.GetUserResonseSchema }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiQuery)({ type: BaseRequestQuerySchema_1.BaseRequestQuerySchema }),
    (0, swagger_1.ApiResponse)({ type: GetUserResponseSchema_1.GetUserResonseSchema }),
    (0, common_1.Get)('/getUserById'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOneById", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, swagger_1.ApiResponse)({ type: GetUserListResponseSchema_1.GetUserListResponseSchema }),
    (0, common_1.Get)('/getUserList'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFilterSchema_1.UserFilterSchama, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllByFilter", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Put)('update'),
    (0, swagger_1.ApiBody)({ type: UpdateUserRequestSchema_1.UpdateUserRequestSchema }),
    (0, swagger_1.ApiResponse)({ type: CreateUserResponseSchema_1.CreateUserResonseSchema }),
    (0, swagger_1.ApiQuery)({ type: BaseRequestQuerySchema_1.BaseRequestQuerySchema }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUserRequestSchema_1.UpdateUserRequestSchema, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Put)('profile'),
    (0, swagger_1.ApiBody)({ type: UpdateProfileRequestSchema_1.UpdateProfileRequestSchema }),
    (0, swagger_1.ApiResponse)({ type: CreateUserResponseSchema_1.CreateUserResonseSchema }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateProfileRequestSchema_1.UpdateProfileRequestSchema, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiResponse)({ description: 'User deleted successfully' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('upload-profile-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadProfileImage", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('User'),
    (0, swagger_1.ApiTags)('users'),
    __metadata("design:paramtypes", [GetUserUsecase_1.GetUserUseCase,
        CreateUserUsecase_1.CreateUserUseCase,
        GetUserListUsecase_1.GetUserListWithFilterUseCase,
        UpdateUserUseCase_1.UpdateUserUseCase,
        UpdateProfileUseCase_1.UpdateProfileUseCase,
        DeleteUserUseCase_1.DeleteUserUseCase,
        PrismaService_1.PrismaService,
        LocalFileUploadService_1.LocalFileUploadService])
], UsersController);
//# sourceMappingURL=users.controller.js.map