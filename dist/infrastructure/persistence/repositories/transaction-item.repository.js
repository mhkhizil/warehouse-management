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
exports.TransactionItemRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionItemRepository = class TransactionItemRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.transactionItem.create({
            data: data,
            include: {
                item: true,
                stock: true,
                transaction: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.transactionItem.findUnique({
            where: { id },
            include: {
                item: true,
                stock: true,
                transaction: true,
            },
        });
    }
    async findAll() {
        return this.prisma.transactionItem.findMany({
            include: {
                item: true,
                stock: true,
                transaction: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, data) {
        return this.prisma.transactionItem.update({
            where: { id },
            data: data,
            include: {
                item: true,
                stock: true,
                transaction: true,
            },
        });
    }
    async delete(id) {
        await this.prisma.transactionItem.delete({
            where: { id },
        });
        return true;
    }
    async findByTransactionId(transactionId) {
        return this.prisma.transactionItem.findMany({
            where: { transactionId },
            include: {
                item: true,
                stock: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findByItemId(itemId) {
        return this.prisma.transactionItem.findMany({
            where: { itemId },
            include: {
                item: true,
                stock: true,
                transaction: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createMany(items) {
        const createdItems = [];
        for (const item of items) {
            const createdItem = await this.create(item);
            createdItems.push(createdItem);
        }
        return createdItems;
    }
    async deleteByTransactionId(transactionId) {
        await this.prisma.transactionItem.deleteMany({
            where: { transactionId },
        });
    }
};
exports.TransactionItemRepository = TransactionItemRepository;
exports.TransactionItemRepository = TransactionItemRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionItemRepository);
//# sourceMappingURL=transaction-item.repository.js.map