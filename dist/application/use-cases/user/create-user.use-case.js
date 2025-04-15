"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CreateUserUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
let CreateUserUseCase = CreateUserUseCase_1 = class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(CreateUserUseCase_1.name);
    }
    async execute(createUserDto) {
        this.logger.log(`Creating user with username: ${createUserDto.username}`);
        const existingUserByUsername = await this.userRepository.findByUsername(createUserDto.username);
        if (existingUserByUsername) {
            this.logger.warn(`Username ${createUserDto.username} already exists`);
            throw new common_1.BadRequestException('Username already exists');
        }
        if (createUserDto.email) {
            const existingUserByEmail = await this.userRepository.findByEmail(createUserDto.email);
            if (existingUserByEmail) {
                this.logger.warn(`Email ${createUserDto.email} already exists`);
                throw new common_1.BadRequestException('Email already exists');
            }
        }
        const hashedPassword = await argon2.hash(createUserDto.password);
        const newUser = await this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        this.logger.log(`User created with ID: ${newUser.id}`);
        return newUser;
    }
};
exports.CreateUserUseCase = CreateUserUseCase;
exports.CreateUserUseCase = CreateUserUseCase = CreateUserUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateUserUseCase);
//# sourceMappingURL=create-user.use-case.js.map