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
exports.ItemRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ItemRepository = class ItemRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.item.create({
            data: data,
        });
    }
    async findById(id) {
        return this.prisma.item.findUnique({
            where: { id },
            include: {
                stock: true,
                subItems: true,
            },
        });
    }
    async findAll() {
        return this.prisma.item.findMany({
            include: {
                stock: true,
                subItems: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.item.update({
            where: { id },
            data,
            include: {
                stock: true,
                subItems: true,
            },
        });
    }
    async delete(id) {
        await this.prisma.item.delete({
            where: { id },
        });
        return true;
    }
    async findByName(name) {
        return this.prisma.item.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
            include: {
                stock: true,
                subItems: true,
            },
        });
    }
    async findSubItems(parentItemId) {
        return this.prisma.item.findMany({
            where: { parentItemId },
            include: { stock: true },
        });
    }
    async findWithFilters(filter) {
        const { name, brand, type, isSellable, skip = 0, take = 10 } = filter;
        const where = {
            ...(name && {
                name: { contains: name, mode: client_1.Prisma.QueryMode.insensitive },
            }),
            ...(brand && {
                brand: { contains: brand, mode: client_1.Prisma.QueryMode.insensitive },
            }),
            ...(type && {
                type: { contains: type, mode: client_1.Prisma.QueryMode.insensitive },
            }),
            ...(isSellable !== undefined && { isSellable }),
        };
        const [items, total] = await Promise.all([
            this.prisma.item.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    stock: true,
                    subItems: true,
                },
            }),
            this.prisma.item.count({ where }),
        ]);
        return { items, total };
    }
};
exports.ItemRepository = ItemRepository;
exports.ItemRepository = ItemRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ItemRepository);
//# sourceMappingURL=item.repository.js.map