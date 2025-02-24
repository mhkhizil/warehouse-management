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
let UsersController = class UsersController {
    constructor(getUserUseCase, createUserUseCase, getUserListWithFilter, updateUserUseCase) {
        this.getUserUseCase = getUserUseCase;
        this.createUserUseCase = createUserUseCase;
        this.getUserListWithFilter = getUserListWithFilter;
        this.updateUserUseCase = updateUserUseCase;
    }
    async findOne(req) {
        return ApiResponseSchema_1.CoreApiResonseSchema.success(await this.getUserUseCase.execute(req.user?.user?.id));
    }
    async findOneById(req, params) {
        return ApiResponseSchema_1.CoreApiResonseSchema.success(await this.getUserUseCase.execute(params.id));
    }
    async getAllByFilter(params) {
        console.log(params);
        const filter = new UserFilter_1.UserFilter(params.name, params.role, parseInt(params?.take.toString()), parseInt(params?.skip.toString()));
        return ApiResponseSchema_1.CoreApiResonseSchema.success(await this.getUserListWithFilter.execute(filter));
    }
    async updateUser(user, params) {
        const updateUserDto = new CreateUserDto_1.CreateUserDto();
        updateUserDto.id = params.id;
        updateUserDto.email = user.email;
        updateUserDto.phone = user.phone;
        updateUserDto.name = user.name;
        updateUserDto.role = user.role;
        return ApiResponseSchema_1.CoreApiResonseSchema.success(await this.updateUserUseCase.execute(updateUserDto));
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserFilterSchema_1.UserFilterSchama]),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUserRequestSchema_1.UpdateUserRequestSchema, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('User'),
    (0, swagger_1.ApiTags)('users'),
    __metadata("design:paramtypes", [GetUserUsecase_1.GetUserUseCase,
        CreateUserUsecase_1.CreateUserUseCase,
        GetUserListUsecase_1.GetUserListWithFilterUseCase,
        UpdateUserUseCase_1.UpdateUserUseCase])
], UsersController);
//# sourceMappingURL=users.controller.js.map