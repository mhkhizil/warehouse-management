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
exports.StaffRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let StaffRepository = class StaffRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.staff.create({
            data: data,
        });
    }
    async findById(id) {
        return this.prisma.staff.findUnique({
            where: { id },
            include: { user: true },
        });
    }
    async findAll() {
        return this.prisma.staff.findMany({
            include: { user: true },
        });
    }
    async update(id, data) {
        return this.prisma.staff.update({
            where: { id },
            data,
            include: { user: true },
        });
    }
    async delete(id) {
        await this.prisma.staff.delete({
            where: { id },
        });
        return true;
    }
    async findByUserId(userId) {
        return this.prisma.staff.findUnique({
            where: { userId },
            include: { user: true },
        });
    }
    async findWithFilters(filter) {
        const { fullName, phone, skip = 0, take = 10 } = filter;
        const where = {
            ...(fullName && {
                fullName: { contains: fullName, mode: client_1.Prisma.QueryMode.insensitive },
            }),
            ...(phone && {
                phone: { contains: phone, mode: client_1.Prisma.QueryMode.insensitive },
            }),
        };
        const [staff, total] = await Promise.all([
            this.prisma.staff.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: { user: true },
            }),
            this.prisma.staff.count({ where }),
        ]);
        return { staff, total };
    }
};
exports.StaffRepository = StaffRepository;
exports.StaffRepository = StaffRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StaffRepository);
//# sourceMappingURL=staff.repository.js.map