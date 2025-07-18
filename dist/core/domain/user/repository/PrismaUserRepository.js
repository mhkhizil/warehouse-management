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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const User_1 = require("../entity/User");
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
const PrismaService_1 = require("../../../common/prisma/PrismaService");
let PrismaUserRepository = class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(user) {
        try {
            const result = await this.prisma.user.create({
                data: {
                    username: user.name,
                    email: user.email,
                    phone: user.phone,
                    password: user.password,
                    role: user.role,
                    remarks: null,
                },
            });
            return User_1.UserEntity.toEntity(result);
        }
        catch (e) {
            if (e instanceof library_1.PrismaClientKnownRequestError) {
                if (e.code == 'P2002') {
                    throw new common_1.BadRequestException({
                        message: 'Bad request',
                        error: e?.meta?.target[0] == 'email'
                            ? 'Email already used'
                            : 'Phone already used',
                    });
                }
                else {
                    throw new common_1.BadRequestException({
                        message: 'Bad request',
                        error: '',
                    });
                }
            }
            else if (e instanceof library_1.PrismaClientValidationError) {
                throw new common_1.InternalServerErrorException({
                    message: 'Internal server error',
                    error: '',
                });
            }
            else {
                throw new common_1.BadRequestException('Internal server error', {
                    cause: new Error(),
                    description: 'Cannot create user',
                });
            }
        }
    }
    async update(user) {
        try {
            const { id, ...userData } = user;
            const result = await this.prisma.user.update({
                where: { id: Number(id) },
                data: {
                    username: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    role: userData.role,
                    updatedAt: new Date(),
                },
            });
            return User_1.UserEntity.toEntity(result);
        }
        catch (e) {
            if (e instanceof library_1.PrismaClientValidationError) {
                throw new common_1.InternalServerErrorException({
                    message: 'Internal server error',
                    error: '',
                });
            }
            if (e instanceof library_1.PrismaClientKnownRequestError) {
                throw new common_1.InternalServerErrorException({
                    message: 'Internal server error',
                    error: '',
                });
            }
        }
    }
    async delete(id) {
        try {
            await this.prisma.user.delete({
                where: { id: Number(id) },
            });
            return true;
        }
        catch (e) {
            if (e instanceof library_1.PrismaClientValidationError) {
                throw new common_1.InternalServerErrorException({
                    message: 'Internal server error',
                    error: '',
                });
            }
            if (e instanceof library_1.PrismaClientKnownRequestError) {
                throw new common_1.InternalServerErrorException({
                    message: 'Internal server error',
                    error: '',
                });
            }
        }
    }
    async find(by) {
        try {
            const where = {};
            if (by.id)
                where.id = Number(by.id);
            if (by.email)
                where.email = by.email;
            if (by.name)
                where.name = by.name;
            if (by.phone)
                where.phone = by.phone;
            const user = await this.prisma.user.findFirst({
                where,
            });
            if (user)
                return User_1.UserEntity.toEntity(user);
            else
                return null;
        }
        catch (e) {
            if (e instanceof library_1.PrismaClientValidationError) {
                throw new common_1.InternalServerErrorException({
                    message: 'Internal server error',
                    error: '',
                });
            }
            if (e instanceof library_1.PrismaClientKnownRequestError) {
                throw new common_1.InternalServerErrorException({
                    message: 'Internal server error',
                    error: '',
                });
            }
        }
    }
    async findAll() {
        const users = await this.prisma.user.findMany({});
        return users.map((user) => User_1.UserEntity.toEntity(user));
    }
    async findAllWithSchema(filter) {
        try {
            const where = {};
            if (filter.name)
                where.username = { contains: filter.name, mode: 'insensitive' };
            if (filter.email)
                where.email = { contains: filter.email, mode: 'insensitive' };
            if (filter.phone)
                where.phone = { contains: filter.phone };
            if (filter.role)
                where.role = filter.role;
            const orderBy = {};
            const sortField = filter.sortBy || 'createdAt';
            const sortOrder = filter.sortOrder || 'desc';
            const fieldMapping = {
                name: 'username',
                email: 'email',
                phone: 'phone',
                role: 'role',
                createdAt: 'createdAt',
                updatedAt: 'updatedAt',
            };
            const prismaFieldName = fieldMapping[sortField] || 'createdAt';
            orderBy[prismaFieldName] = sortOrder;
            const totalCounts = await this.prisma.user.count({
                where,
            });
            const users = await this.prisma.user.findMany({
                where,
                take: filter.take,
                skip: filter.skip,
                orderBy: orderBy,
            });
            return {
                users: users.map((product) => User_1.UserEntity.toEntity(product)),
                totalCounts: totalCounts,
            };
        }
        catch (e) {
            throw new common_1.InternalServerErrorException({
                message: 'Internal server error',
                error: '',
            });
        }
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    __param(0, (0, common_1.Inject)()),
    __metadata("design:paramtypes", [PrismaService_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=PrismaUserRepository.js.map