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
exports.StockRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StockRepository = class StockRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.stock.create({
            data: data,
            include: {
                item: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.stock.findUnique({
            where: { id },
            include: {
                item: true,
                transactions: {
                    take: 5,
                    orderBy: { date: 'desc' },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.stock.findMany({
            include: {
                item: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.stock.update({
            where: { id },
            data,
            include: {
                item: true,
            },
        });
    }
    async delete(id) {
        await this.prisma.stock.delete({
            where: { id },
        });
        return true;
    }
    async findByItemId(itemId) {
        return this.prisma.stock.findFirst({
            where: { itemId },
            include: {
                item: true,
                transactions: {
                    take: 5,
                    orderBy: { date: 'desc' },
                },
            },
        });
    }
    async updateQuantity(id, quantity) {
        return this.prisma.stock.update({
            where: { id },
            data: {
                quantity,
                lastRefilled: new Date(),
            },
            include: {
                item: true,
            },
        });
    }
    async findLowStock(threshold) {
        return this.prisma.stock.findMany({
            where: {
                refillAlert: true,
                ...(threshold !== undefined && { quantity: { lte: threshold } }),
            },
            include: {
                item: true,
            },
        });
    }
    async findWithFilters(filter) {
        const { refillAlert, itemId, minQuantity, maxQuantity, skip = 0, take = 10, } = filter;
        const where = {
            ...(refillAlert !== undefined && { refillAlert }),
            ...(itemId !== undefined && { itemId }),
            ...((minQuantity !== undefined || maxQuantity !== undefined) && {
                quantity: {
                    ...(minQuantity !== undefined && { gte: minQuantity }),
                    ...(maxQuantity !== undefined && { lte: maxQuantity }),
                },
            }),
        };
        const [stocks, total] = await Promise.all([
            this.prisma.stock.findMany({
                where,
                skip,
                take,
                orderBy: { updatedAt: 'desc' },
                include: {
                    item: true,
                },
            }),
            this.prisma.stock.count({ where }),
        ]);
        return { stocks, total };
    }
};
exports.StockRepository = StockRepository;
exports.StockRepository = StockRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockRepository);
//# sourceMappingURL=stock.repository.js.map