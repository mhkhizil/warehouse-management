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
var UpdateUserUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
let UpdateUserUseCase = UpdateUserUseCase_1 = class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UpdateUserUseCase_1.name);
    }
    async execute(id, updateUserDto) {
        this.logger.log(`Updating user with ID: ${id}`);
        const user = await this.userRepository.findById(id);
        if (!user) {
            this.logger.warn(`User with ID ${id} not found`);
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUserWithEmail = await this.userRepository.findByEmail(updateUserDto.email);
            if (existingUserWithEmail && existingUserWithEmail.id !== id) {
                this.logger.warn(`Email ${updateUserDto.email} already in use by another user`);
                throw new common_1.BadRequestException('Email already in use by another user');
            }
        }
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUserWithUsername = await this.userRepository.findByUsername(updateUserDto.username);
            if (existingUserWithUsername && existingUserWithUsername.id !== id) {
                this.logger.warn(`Username ${updateUserDto.username} already in use by another user`);
                throw new common_1.BadRequestException('Username already in use by another user');
            }
        }
        let dataToUpdate = {
            ...updateUserDto,
        };
        if (updateUserDto.password) {
            if (updateUserDto.currentPassword) {
                const isPasswordValid = await argon2.verify(user.password, updateUserDto.currentPassword);
                if (!isPasswordValid) {
                    this.logger.warn('Current password is incorrect');
                    throw new common_1.UnauthorizedException('Current password is incorrect');
                }
            }
            dataToUpdate.password = await argon2.hash(updateUserDto.password);
        }
        delete dataToUpdate.currentPassword;
        const updatedUser = await this.userRepository.update(id, dataToUpdate);
        this.logger.log(`User with ID ${id} updated successfully`);
        return updatedUser;
    }
};
exports.UpdateUserUseCase = UpdateUserUseCase;
exports.UpdateUserUseCase = UpdateUserUseCase = UpdateUserUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], UpdateUserUseCase);
//# sourceMappingURL=update-user.use-case.js.map