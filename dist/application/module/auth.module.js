"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("../controller/auth.controller");
const Authservice_1 = require("../../core/domain/auth/service/Authservice");
const jwt_1 = require("@nestjs/jwt");
const IUserRepositoryPort_1 = require("../../core/domain/user/port/repository-port/IUserRepositoryPort");
const PrismaUserRepository_1 = require("../../core/domain/user/repository/PrismaUserRepository");
const local_strategy_1 = require("../auth/passport/local.strategy");
const users_module_1 = require("./users.module");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("../auth/passport/jwt.strategy");
const process_1 = require("process");
const CreateUserUsecase_1 = require("../../core/domain/user/service/CreateUserUsecase");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process_1.env.JWT_SECRET_KEY,
                signOptions: {},
            }),
            users_module_1.UsersModule,
            passport_1.PassportModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            Authservice_1.AuthService,
            {
                provide: IUserRepositoryPort_1.IUserRepository,
                useClass: PrismaUserRepository_1.PrismaUserRepository,
            },
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            CreateUserUsecase_1.CreateUserUseCase,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map