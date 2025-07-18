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
exports.TransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionRepository = class TransactionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { createDebt, debt, createSupplierDebt, supplierDebt, items, ...transactionData } = data;
        return this.prisma.transaction.create({
            data: transactionData,
            include: {
                customer: true,
                supplier: true,
                debt: true,
                supplierDebt: true,
                transactionItems: {
                    include: {
                        item: true,
                        stock: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        return this.prisma.transaction.findUnique({
            where: { id },
            include: {
                customer: true,
                supplier: true,
                debt: true,
                supplierDebt: true,
                transactionItems: {
                    include: {
                        item: true,
                        stock: true,
                    },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.transaction.findMany({
            include: {
                customer: true,
                supplier: true,
                debt: true,
                supplierDebt: true,
                transactionItems: {
                    include: {
                        item: true,
                        stock: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    async update(id, data) {
        return this.prisma.transaction.update({
            where: { id },
            data,
            include: {
                customer: true,
                supplier: true,
                debt: true,
                supplierDebt: true,
                transactionItems: {
                    include: {
                        item: true,
                        stock: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        await this.prisma.transaction.delete({
            where: { id },
        });
        return true;
    }
    async findByCustomerId(customerId) {
        return this.prisma.transaction.findMany({
            where: { customerId },
            include: {
                customer: true,
                supplier: true,
                debt: true,
                supplierDebt: true,
                transactionItems: {
                    include: {
                        item: true,
                        stock: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    async findBySupplierId(supplierId) {
        return this.prisma.transaction.findMany({
            where: { supplierId },
            include: {
                customer: true,
                supplier: true,
                debt: true,
                supplierDebt: true,
                transactionItems: {
                    include: {
                        item: true,
                        stock: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
    }
    async findWithFilters(filter) {
        const { type, customerId, supplierId, startDate, endDate, minAmount, maxAmount, skip = 0, take = 10, } = filter;
        const where = {
            ...(type && { type }),
            ...(customerId && { customerId }),
            ...(supplierId && { supplierId }),
            ...((startDate || endDate) && {
                date: {
                    ...(startDate && { gte: startDate }),
                    ...(endDate && { lte: endDate }),
                },
            }),
            ...((minAmount !== undefined || maxAmount !== undefined) && {
                totalAmount: {
                    ...(minAmount !== undefined && { gte: minAmount }),
                    ...(maxAmount !== undefined && { lte: maxAmount }),
                },
            }),
        };
        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                skip,
                take,
                orderBy: { date: 'desc' },
                include: {
                    customer: true,
                    supplier: true,
                    debt: true,
                    supplierDebt: true,
                    transactionItems: {
                        include: {
                            item: true,
                            stock: true,
                        },
                    },
                },
            }),
            this.prisma.transaction.count({ where }),
        ]);
        return { transactions, total };
    }
    async getSalesReport(startDate, endDate) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                type: 'SELL',
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                customer: true,
                debt: true,
                transactionItems: {
                    include: {
                        item: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
        const totalSales = transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
        return { totalSales, transactions };
    }
    async getPurchaseReport(startDate, endDate) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                type: 'BUY',
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                customer: true,
                supplier: true,
                supplierDebt: true,
                transactionItems: {
                    include: {
                        item: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });
        const totalPurchases = transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
        return { totalPurchases, transactions };
    }
};
exports.TransactionRepository = TransactionRepository;
exports.TransactionRepository = TransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionRepository);
//# sourceMappingURL=transaction.repository.js.map