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
exports.DeleteUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const IUserRepositoryPort_1 = require("../port/repository-port/IUserRepositoryPort");
const PrismaService_1 = require("../../../common/prisma/PrismaService");
const UserEnum_1 = require("../../../common/type/UserEnum");
let DeleteUserUseCase = class DeleteUserUseCase {
    constructor(userRepository, prisma) {
        this.userRepository = userRepository;
        this.prisma = prisma;
    }
    async execute(adminUserId, userIdToDelete) {
        const adminUser = await this.prisma.user.findUnique({
            where: { id: Number(adminUserId) },
            select: {
                id: true,
                role: true,
            },
        });
        if (!adminUser) {
            throw new common_1.NotFoundException('Admin user not found');
        }
        if (adminUser.role !== UserEnum_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only administrators can delete users');
        }
        if (adminUserId === userIdToDelete) {
            throw new common_1.BadRequestException('Administrators cannot delete their own accounts');
        }
        const userToDelete = await this.prisma.user.findUnique({
            where: { id: Number(userIdToDelete) },
        });
        if (!userToDelete) {
            throw new common_1.NotFoundException(`User with ID ${userIdToDelete} not found`);
        }
        try {
            const staffRecord = await this.prisma.staff.findUnique({
                where: { userId: Number(userIdToDelete) },
            });
            if (staffRecord) {
                await this.prisma.staff.delete({
                    where: { userId: Number(userIdToDelete) },
                });
            }
            await this.prisma.user.delete({
                where: { id: Number(userIdToDelete) },
            });
            return true;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to delete user: ${error.message}`);
        }
    }
};
exports.DeleteUserUseCase = DeleteUserUseCase;
exports.DeleteUserUseCase = DeleteUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)()),
    __param(1, (0, common_1.Inject)()),
    __metadata("design:paramtypes", [IUserRepositoryPort_1.IUserRepository,
        PrismaService_1.PrismaService])
], DeleteUserUseCase);
//# sourceMappingURL=DeleteUserUseCase.js.map