"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("../controller/users.controller");
const CreateUserUsecase_1 = require("../../core/domain/user/service/CreateUserUsecase");
const IUserRepositoryPort_1 = require("../../core/domain/user/port/repository-port/IUserRepositoryPort");
const PrismaUserRepository_1 = require("../../core/domain/user/repository/PrismaUserRepository");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const GetUserUsecase_1 = require("../../core/domain/user/service/GetUserUsecase");
const GetUserListUsecase_1 = require("../../core/domain/user/service/GetUserListUsecase");
const UpdateUserUseCase_1 = require("../../core/domain/user/service/UpdateUserUseCase");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController],
        providers: [
            CreateUserUsecase_1.CreateUserUseCase,
            jwt_guard_1.JwtGuard,
            GetUserUsecase_1.GetUserUseCase,
            GetUserListUsecase_1.GetUserListWithFilterUseCase,
            UpdateUserUseCase_1.UpdateUserUseCase,
            {
                provide: IUserRepositoryPort_1.IUserRepository,
                useClass: PrismaUserRepository_1.PrismaUserRepository,
            },
        ],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map