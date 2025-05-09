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
exports.BuyFromSupplierUseCase = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../infrastructure/persistence/prisma/prisma.service");
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
let BuyFromSupplierUseCase = class BuyFromSupplierUseCase {
    constructor(supplierRepository, itemRepository, stockRepository, transactionRepository, supplierDebtRepository, prisma) {
        this.supplierRepository = supplierRepository;
        this.itemRepository = itemRepository;
        this.stockRepository = stockRepository;
        this.transactionRepository = transactionRepository;
        this.supplierDebtRepository = supplierDebtRepository;
        this.prisma = prisma;
    }
    async execute(data) {
        const supplier = await this.supplierRepository.findById(data.supplierId);
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${data.supplierId} not found`);
        }
        const item = await this.itemRepository.findById(data.itemId);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${data.itemId} not found`);
        }
        if (data.quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than zero');
        }
        if (data.unitPrice <= 0) {
            throw new common_1.BadRequestException('Unit price must be greater than zero');
        }
        const totalAmount = data.quantity * data.unitPrice;
        return this.prisma.$transaction(async (prismaClient) => {
            let stock = await this.stockRepository.findByItemId(data.itemId);
            if (!stock) {
                stock = await this.stockRepository.create({
                    itemId: data.itemId,
                    quantity: 0,
                    refillAlert: false,
                    lastRefilled: new Date(),
                });
            }
            await this.stockRepository.update(stock.id, {
                quantity: stock.quantity + data.quantity,
                lastRefilled: new Date(),
            });
            const transaction = await this.transactionRepository.create({
                type: client_1.TransactionType.BUY,
                itemId: data.itemId,
                stockId: stock.id,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
                totalAmount: totalAmount,
                date: new Date(),
                customerId: null,
                supplierId: data.supplierId,
            });
            if (data.createDebt && data.debtDueDate) {
                await this.supplierDebtRepository.create({
                    supplierId: data.supplierId,
                    amount: totalAmount,
                    dueDate: new Date(data.debtDueDate),
                    isSettled: false,
                    transactionId: transaction.id,
                    remarks: data.debtRemarks,
                });
            }
            return transaction;
        });
    }
};
exports.BuyFromSupplierUseCase = BuyFromSupplierUseCase;
exports.BuyFromSupplierUseCase = BuyFromSupplierUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_REPOSITORY)),
    __param(1, (0, common_1.Inject)(repository_tokens_1.ITEM_REPOSITORY)),
    __param(2, (0, common_1.Inject)(repository_tokens_1.STOCK_REPOSITORY)),
    __param(3, (0, common_1.Inject)(repository_tokens_1.TRANSACTION_REPOSITORY)),
    __param(4, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_DEBT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, prisma_service_1.PrismaService])
], BuyFromSupplierUseCase);
//# sourceMappingURL=buy-from-supplier.use-case.js.map