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
exports.SupplierRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SupplierRepository = class SupplierRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.supplier.create({
            data: data,
        });
    }
    async findById(id) {
        const supplierId = typeof id === 'string' ? parseInt(id, 10) : id;
        console.log(`Repository: Finding supplier with ID: ${supplierId}, type: ${typeof supplierId}`);
        try {
            const result = await this.prisma.supplier.findFirst({
                where: {
                    id: supplierId,
                    isActive: true,
                },
                include: {
                    debt: true,
                    transactions: true,
                },
            });
            console.log(`Repository: Supplier search result: ${result ? 'Found' : 'Not found'}`);
            if (result) {
                console.log(`Repository: Supplier details: ID=${result.id}, Name=${result.name}, isActive=${result.isActive}`);
            }
            return result;
        }
        catch (error) {
            console.error('Repository: Error finding supplier:', error);
            throw error;
        }
    }
    async findAll() {
        return this.prisma.supplier.findMany({
            where: {
                isActive: true,
            },
            include: {
                debt: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.supplier.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        const result = await this.prisma.supplier.update({
            where: { id },
            data: { isActive: false },
        });
        return !!result;
    }
    async findByEmail(email) {
        return this.prisma.supplier.findFirst({
            where: {
                email,
                isActive: true,
            },
        });
    }
    async findByPhone(phone) {
        return this.prisma.supplier.findFirst({
            where: {
                phone,
                isActive: true,
            },
        });
    }
    async findWithFilters(filter) {
        const where = {
            isActive: filter.isActive !== undefined ? filter.isActive : true,
        };
        if (filter.name) {
            where.name = { contains: filter.name, mode: 'insensitive' };
        }
        if (filter.email) {
            where.email = { contains: filter.email, mode: 'insensitive' };
        }
        if (filter.phone) {
            where.phone = { contains: filter.phone };
        }
        const [suppliers, total] = await Promise.all([
            this.prisma.supplier.findMany({
                where,
                take: filter.take,
                skip: filter.skip,
                include: {
                    debt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.supplier.count({ where }),
        ]);
        return { suppliers, total };
    }
    async findWithDebts() {
        return this.prisma.supplier.findMany({
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
};
exports.SupplierRepository = SupplierRepository;
exports.SupplierRepository = SupplierRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SupplierRepository);
//# sourceMappingURL=supplier.repository.js.map