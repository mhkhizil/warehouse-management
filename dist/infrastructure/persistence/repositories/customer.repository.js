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
exports.CustomerRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomerRepository = class CustomerRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.customer.create({
            data: data,
        });
    }
    async findById(id) {
        return this.prisma.customer.findFirst({
            where: {
                id,
                isActive: true,
            },
            include: {
                debt: true,
                transactions: {
                    take: 5,
                    orderBy: { date: 'desc' },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.customer.findMany({
            where: {
                isActive: true,
            },
            include: {
                debt: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.customer.update({
            where: { id },
            data,
            include: {
                debt: true,
            },
        });
    }
    async delete(id) {
        const result = await this.prisma.customer.update({
            where: { id },
            data: { isActive: false },
        });
        return !!result;
    }
    async findByEmail(email) {
        return this.prisma.customer.findFirst({
            where: {
                email,
                isActive: true,
            },
            include: {
                debt: true,
            },
        });
    }
    async findByPhone(phone) {
        return this.prisma.customer.findFirst({
            where: {
                phone,
                isActive: true,
            },
            include: {
                debt: true,
            },
        });
    }
    async findWithDebts() {
        return this.prisma.customer.findMany({
            where: {
                isActive: true,
                debt: {
                    some: {
                        isSettled: false,
                    },
                },
            },
            include: {
                debt: {
                    where: {
                        isSettled: false,
                    },
                },
            },
        });
    }
    async findWithFilters(filter) {
        const { name, phone, email, hasDebt, skip = 0, take = 10, isActive, } = filter;
        const where = {
            isActive: isActive !== undefined ? isActive : true,
            ...(name && {
                name: { contains: name, mode: client_1.Prisma.QueryMode.insensitive },
            }),
            ...(phone && {
                phone: { contains: phone, mode: client_1.Prisma.QueryMode.insensitive },
            }),
            ...(email && {
                email: { contains: email, mode: client_1.Prisma.QueryMode.insensitive },
            }),
            ...(hasDebt !== undefined &&
                hasDebt && {
                debt: {
                    some: {
                        isSettled: false,
                    },
                },
            }),
        };
        const [customers, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    debt: true,
                },
            }),
            this.prisma.customer.count({ where }),
        ]);
        return { customers, total };
    }
};
exports.CustomerRepository = CustomerRepository;
exports.CustomerRepository = CustomerRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerRepository);
//# sourceMappingURL=customer.repository.js.map