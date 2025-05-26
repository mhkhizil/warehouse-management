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
var CreateTransactionUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionUseCase = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const repository_tokens_1 = require("../../../domain/constants/repository.tokens");
let CreateTransactionUseCase = CreateTransactionUseCase_1 = class CreateTransactionUseCase {
    constructor(transactionRepository, itemRepository, stockRepository, customerRepository, debtRepository, supplierRepository, supplierDebtRepository) {
        this.transactionRepository = transactionRepository;
        this.itemRepository = itemRepository;
        this.stockRepository = stockRepository;
        this.customerRepository = customerRepository;
        this.debtRepository = debtRepository;
        this.supplierRepository = supplierRepository;
        this.supplierDebtRepository = supplierDebtRepository;
        this.logger = new common_1.Logger(CreateTransactionUseCase_1.name);
    }
    async execute(createTransactionDto) {
        this.logger.log(`Creating transaction with type: ${createTransactionDto.type}`);
        const item = await this.itemRepository.findById(createTransactionDto.itemId);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${createTransactionDto.itemId} not found`);
        }
        if (createTransactionDto.type === client_1.TransactionType.SELL) {
            if (!createTransactionDto.customerId) {
                throw new common_1.BadRequestException('Customer ID is required for SELL transactions');
            }
            const customer = await this.customerRepository.findById(createTransactionDto.customerId);
            if (!customer) {
                throw new common_1.NotFoundException(`Customer with ID ${createTransactionDto.customerId} not found`);
            }
            if (!item.isSellable) {
                throw new common_1.BadRequestException(`Item with ID ${createTransactionDto.itemId} is not sellable`);
            }
            const stock = await this.stockRepository.findByItemId(createTransactionDto.itemId);
            if (!stock) {
                throw new common_1.NotFoundException(`No stock found for item with ID ${createTransactionDto.itemId}`);
            }
            if (stock.quantity < createTransactionDto.quantity) {
                throw new common_1.BadRequestException(`Not enough stock. Requested: ${createTransactionDto.quantity}, Available: ${stock.quantity}`);
            }
            await this.stockRepository.updateQuantity(stock.id, stock.quantity - createTransactionDto.quantity);
        }
        else if (createTransactionDto.type === client_1.TransactionType.BUY) {
            if (!createTransactionDto.supplierId) {
                throw new common_1.BadRequestException('Supplier ID is required for BUY transactions');
            }
            const supplierId = typeof createTransactionDto.supplierId === 'string'
                ? parseInt(createTransactionDto.supplierId, 10)
                : createTransactionDto.supplierId;
            console.log(`Supplier ID: ${supplierId}, Type: ${typeof supplierId}`);
            try {
                const supplier = await this.supplierRepository.findById(supplierId);
                console.log('Supplier search result:', supplier ? 'Found' : 'Not found');
                if (!supplier) {
                    throw new common_1.NotFoundException(`Supplier with ID ${supplierId} not found`);
                }
            }
            catch (error) {
                console.error('Error finding supplier:', error);
                throw error;
            }
            if (!createTransactionDto.stockId) {
                let stock = await this.stockRepository.findByItemId(createTransactionDto.itemId);
                if (!stock) {
                    stock = await this.stockRepository.create({
                        itemId: createTransactionDto.itemId,
                        quantity: 0,
                        refillAlert: false,
                        lastRefilled: new Date(),
                    });
                }
                createTransactionDto.stockId = stock.id;
            }
            const stock = await this.stockRepository.findById(createTransactionDto.stockId);
            if (!stock) {
                throw new common_1.NotFoundException(`Stock with ID ${createTransactionDto.stockId} not found`);
            }
            await this.stockRepository.updateQuantity(stock.id, stock.quantity + createTransactionDto.quantity);
        }
        if (!createTransactionDto.totalAmount) {
            createTransactionDto.totalAmount =
                createTransactionDto.unitPrice * createTransactionDto.quantity;
        }
        if (!createTransactionDto.date) {
            createTransactionDto.date = new Date();
        }
        const transaction = await this.transactionRepository.create(createTransactionDto);
        if (createTransactionDto.type === client_1.TransactionType.SELL &&
            createTransactionDto.createDebt &&
            createTransactionDto.debt) {
            createTransactionDto.debt.transactionId = transaction.id;
            if (!createTransactionDto.debt.customerId) {
                createTransactionDto.debt.customerId = createTransactionDto.customerId;
            }
            await this.debtRepository.create(createTransactionDto.debt);
        }
        if (createTransactionDto.type === client_1.TransactionType.BUY &&
            createTransactionDto.createSupplierDebt &&
            createTransactionDto.supplierDebt) {
            createTransactionDto.supplierDebt.transactionId = transaction.id;
            if (!createTransactionDto.supplierDebt.supplierId) {
                createTransactionDto.supplierDebt.supplierId =
                    createTransactionDto.supplierId;
            }
            await this.supplierDebtRepository.create({
                ...createTransactionDto.supplierDebt,
                dueDate: new Date(createTransactionDto.supplierDebt.dueDate),
            });
        }
        return transaction;
    }
};
exports.CreateTransactionUseCase = CreateTransactionUseCase;
exports.CreateTransactionUseCase = CreateTransactionUseCase = CreateTransactionUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.TRANSACTION_REPOSITORY)),
    __param(1, (0, common_1.Inject)(repository_tokens_1.ITEM_REPOSITORY)),
    __param(2, (0, common_1.Inject)(repository_tokens_1.STOCK_REPOSITORY)),
    __param(3, (0, common_1.Inject)(repository_tokens_1.CUSTOMER_REPOSITORY)),
    __param(4, (0, common_1.Inject)(repository_tokens_1.DEBT_REPOSITORY)),
    __param(5, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_REPOSITORY)),
    __param(6, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_DEBT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], CreateTransactionUseCase);
//# sourceMappingURL=create-transaction.use-case.js.map