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
exports.UpdateUserUseCase = void 0;
const IUserRepositoryPort_1 = require("../port/repository-port/IUserRepositoryPort");
const User_1 = require("../entity/User");
const common_1 = require("@nestjs/common");
let UpdateUserUseCase = class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        const currentUser = await this.userRepository.find({ id: data?.id });
        if (!currentUser) {
            throw new common_1.BadRequestException('User not found');
        }
        if (data?.phone && data.phone !== currentUser.phone) {
            const existingUserWithPhone = await this.userRepository.find({
                phone: data.phone,
            });
            if (existingUserWithPhone && existingUserWithPhone.id !== data.id) {
                throw new common_1.BadRequestException('Phone number already in use by another user');
            }
        }
        if (data?.email && data.email !== currentUser.email) {
            const existingUserWithEmail = await this.userRepository.find({
                email: data.email,
            });
            if (existingUserWithEmail && existingUserWithEmail.id !== data.id) {
                throw new common_1.BadRequestException('Email already in use by another user');
            }
        }
        const newUser = new User_1.UserEntity(data?.id, data?.name, data?.email, data?.phone, data?.role);
        const createdUser = await this.userRepository.update(newUser);
        return createdUser;
    }
};
exports.UpdateUserUseCase = UpdateUserUseCase;
exports.UpdateUserUseCase = UpdateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)()),
    __metadata("design:paramtypes", [IUserRepositoryPort_1.IUserRepository])
], UpdateUserUseCase);
//# sourceMappingURL=UpdateUserUseCase.js.map