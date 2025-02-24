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
exports.GetUserListWithFilterUseCase = void 0;
const common_1 = require("@nestjs/common");
const IUserRepositoryPort_1 = require("../port/repository-port/IUserRepositoryPort");
const CreateUserDto_1 = require("../dto/CreateUserDto");
let GetUserListWithFilterUseCase = class GetUserListWithFilterUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(filter) {
        const list = await this.userRepository.findAllWithSchema(filter);
        return {
            users: list.users.map((product) => CreateUserDto_1.CreateUserDto.convertToClass(product)),
            totalCounts: list.totalCounts,
        };
    }
};
exports.GetUserListWithFilterUseCase = GetUserListWithFilterUseCase;
exports.GetUserListWithFilterUseCase = GetUserListWithFilterUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)()),
    __metadata("design:paramtypes", [IUserRepositoryPort_1.IUserRepository])
], GetUserListWithFilterUseCase);
//# sourceMappingURL=GetUserListUsecase.js.map