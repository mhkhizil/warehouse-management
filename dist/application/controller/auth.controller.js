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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const Authservice_1 = require("../../core/domain/auth/service/Authservice");
const local_guard_1 = require("../auth/guard/local.guard");
const swagger_1 = require("@nestjs/swagger");
const AuthRequestSchema_1 = require("./documentation/auth/RequestSchema/AuthRequestSchema");
const AuthResponseSchema_1 = require("./documentation/auth/ResponseSchema/AuthResponseSchema");
const ApiResponseSchema_1 = require("../../core/common/schema/ApiResponseSchema");
const CreateUserRequestSchema_1 = require("./documentation/user/RequsetSchema/CreateUserRequestSchema");
const CreateUserResponseSchema_1 = require("./documentation/user/ResponseSchema/CreateUserResponseSchema");
const CreateUserUsecase_1 = require("../../core/domain/user/service/CreateUserUsecase");
const CreateUserDto_1 = require("../../core/domain/user/dto/CreateUserDto");
let AuthController = class AuthController {
    constructor(authService, createUserUseCase) {
        this.authService = authService;
        this.createUserUseCase = createUserUseCase;
    }
    async SignIn(credential) {
        const result = await this.authService.validateUser(credential);
        return ApiResponseSchema_1.CoreApiResonseSchema.success({ token: result });
    }
    async Login(user) {
        const createUserDto = new CreateUserDto_1.CreateUserDto();
        createUserDto.email = user.email;
        createUserDto.phone = user.phone;
        createUserDto.name = user.name;
        createUserDto.password = user.password;
        createUserDto.role = user.role;
        return ApiResponseSchema_1.CoreApiResonseSchema.success(await this.createUserUseCase.execute(createUserDto));
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UseGuards)(local_guard_1.LocalGuard),
    (0, swagger_1.ApiBody)({ type: AuthRequestSchema_1.AuthRequestSchema }),
    (0, swagger_1.ApiResponse)({ type: AuthResponseSchema_1.AuthResponseSchema }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthRequestSchema_1.AuthRequestSchema]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SignIn", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiBody)({ type: CreateUserRequestSchema_1.CreateUserSchema }),
    (0, swagger_1.ApiResponse)({ type: CreateUserResponseSchema_1.CreateUserResonseSchema }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserRequestSchema_1.CreateUserSchema]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "Login", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __param(0, (0, common_1.Inject)()),
    __metadata("design:paramtypes", [Authservice_1.AuthService,
        CreateUserUsecase_1.CreateUserUseCase])
], AuthController);
//# sourceMappingURL=auth.controller.js.map