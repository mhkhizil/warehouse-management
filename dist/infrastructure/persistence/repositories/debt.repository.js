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
exports.DebtRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DebtRepository = class DebtRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.debt.create({
            data: data,
            include: {
                customer: true,
                transaction: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.debt.findUnique({
            where: { id },
            include: {
                customer: true,
                transaction: true,
            },
        });
    }
    async findAll() {
        return this.prisma.debt.findMany({
            include: {
                customer: true,
                transaction: true,
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    async update(id, data) {
        return this.prisma.debt.update({
            where: { id },
            data,
            include: {
                customer: true,
                transaction: true,
            },
        });
    }
    async delete(id) {
        await this.prisma.debt.delete({
            where: { id },
        });
        return true;
    }
    async findByCustomerId(customerId) {
        return this.prisma.debt.findMany({
            where: { customerId },
            include: {
                transaction: true,
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    async findByTransactionId(transactionId) {
        return this.prisma.debt.findFirst({
            where: { transactionId },
            include: {
                customer: true,
                transaction: true,
            },
        });
    }
    async markAsSettled(id) {
        return this.prisma.debt.update({
            where: { id },
            data: {
                isSettled: true,
                updatedAt: new Date(),
            },
            include: {
                customer: true,
                transaction: true,
            },
        });
    }
    async markAlertSent(id) {
        return this.prisma.debt.update({
            where: { id },
            data: {
                alertSent: true,
                updatedAt: new Date(),
            },
            include: {
                customer: true,
            },
        });
    }
    async findOverdueDebts() {
        const now = new Date();
        return this.prisma.debt.findMany({
            where: {
                dueDate: { lt: now },
                isSettled: false,
            },
            include: {
                customer: true,
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    async findWithFilters(filter) {
        const { customerId, isSettled, alertSent, dueBefore, dueAfter, skip = 0, take = 10, } = filter;
        const where = {
            ...(customerId && { customerId }),
            ...(isSettled !== undefined && { isSettled }),
            ...(alertSent !== undefined && { alertSent }),
            ...((dueBefore || dueAfter) && {
                dueDate: {
                    ...(dueBefore && { lte: dueBefore }),
                    ...(dueAfter && { gte: dueAfter }),
                },
            }),
        };
        const [debts, total] = await Promise.all([
            this.prisma.debt.findMany({
                where,
                skip,
                take,
                orderBy: { dueDate: 'asc' },
                include: {
                    customer: true,
                    transaction: true,
                },
            }),
            this.prisma.debt.count({ where }),
        ]);
        return { debts, total };
    }
};
exports.DebtRepository = DebtRepository;
exports.DebtRepository = DebtRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DebtRepository);
//# sourceMappingURL=debt.repository.js.map