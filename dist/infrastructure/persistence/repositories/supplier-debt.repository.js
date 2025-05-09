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
exports.SupplierDebtRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SupplierDebtRepository = class SupplierDebtRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.supplierDebt.create({
            data: data,
        });
    }
    async findById(id) {
        return this.prisma.supplierDebt.findUnique({
            where: { id },
            include: {
                supplier: true,
                transaction: true,
            },
        });
    }
    async findAll() {
        return this.prisma.supplierDebt.findMany({
            include: {
                supplier: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.supplierDebt.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        try {
            await this.prisma.supplierDebt.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async findBySupplierId(supplierId) {
        return this.prisma.supplierDebt.findMany({
            where: { supplierId },
            include: {
                transaction: true,
            },
            orderBy: {
                dueDate: 'asc',
            },
        });
    }
    async findByTransactionId(transactionId) {
        return this.prisma.supplierDebt.findFirst({
            where: { transactionId },
            include: {
                supplier: true,
                transaction: true,
            },
        });
    }
    async findUnsettled() {
        return this.prisma.supplierDebt.findMany({
            where: {
                isSettled: false,
            },
            include: {
                supplier: true,
            },
            orderBy: {
                dueDate: 'asc',
            },
        });
    }
    async findUnsettledBySupplierId(supplierId) {
        return this.prisma.supplierDebt.findMany({
            where: {
                supplierId,
                isSettled: false,
            },
            include: {
                transaction: true,
            },
            orderBy: {
                dueDate: 'asc',
            },
        });
    }
    async findWithFilters(filter) {
        const where = {};
        if (filter.supplierId !== undefined) {
            where.supplierId = filter.supplierId;
        }
        if (filter.isSettled !== undefined) {
            where.isSettled = filter.isSettled;
        }
        if (filter.dueBefore) {
            where.dueDate = {
                ...(where.dueDate || {}),
                lte: filter.dueBefore,
            };
        }
        if (filter.dueAfter) {
            where.dueDate = {
                ...(where.dueDate || {}),
                gte: filter.dueAfter,
            };
        }
        const [debts, total] = await Promise.all([
            this.prisma.supplierDebt.findMany({
                where,
                take: filter.take,
                skip: filter.skip,
                include: {
                    supplier: true,
                    transaction: true,
                },
                orderBy: {
                    dueDate: 'asc',
                },
            }),
            this.prisma.supplierDebt.count({ where }),
        ]);
        return { debts, total };
    }
    async updateSettlementStatus(id, isSettled) {
        return this.prisma.supplierDebt.update({
            where: { id },
            data: {
                isSettled,
            },
        });
    }
};
exports.SupplierDebtRepository = SupplierDebtRepository;
exports.SupplierDebtRepository = SupplierDebtRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupplierDebtRepository);
//# sourceMappingURL=supplier-debt.repository.js.map