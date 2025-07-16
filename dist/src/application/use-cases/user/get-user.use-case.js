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
var GetUserUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserUseCase = void 0;
const common_1 = require("@nestjs/common");
let GetUserUseCase = GetUserUseCase_1 = class GetUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(GetUserUseCase_1.name);
    }
    async execute(id) {
        this.logger.log(`Fetching user with ID: ${id}`);
        const user = await this.userRepository.findById(id);
        if (!user) {
            this.logger.warn(`User with ID ${id} not found`);
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async getByUsername(username) {
        this.logger.log(`Fetching user with username: ${username}`);
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            this.logger.warn(`User with username ${username} not found`);
            throw new common_1.NotFoundException(`User with username ${username} not found`);
        }
        return user;
    }
};
exports.GetUserUseCase = GetUserUseCase;
exports.GetUserUseCase = GetUserUseCase = GetUserUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], GetUserUseCase);
//# sourceMappingURL=get-user.use-case.js.map