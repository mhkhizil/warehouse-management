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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const UserEnum_1 = require("../../../core/common/type/UserEnum");
const client_1 = require("@prisma/client");
let AdminGuard = class AdminGuard {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.user?.id;
        if (!userId) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: Number(userId) },
            select: { role: true },
        });
        if (!user || user.role !== UserEnum_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Access denied. Only administrators can perform this action.');
        }
        return true;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map