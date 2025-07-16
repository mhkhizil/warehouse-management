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
const prisma_service_1 = require("../../../infrastructure/persistence/prisma/prisma.service");
let CreateTransactionUseCase = CreateTransactionUseCase_1 = class CreateTransactionUseCase {
    constructor(transactionRepository, transactionItemRepository, itemRepository, stockRepository, customerRepository, debtRepository, supplierRepository, supplierDebtRepository, prisma) {
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.itemRepository = itemRepository;
        this.stockRepository = stockRepository;
        this.customerRepository = customerRepository;
        this.debtRepository = debtRepository;
        this.supplierRepository = supplierRepository;
        this.supplierDebtRepository = supplierDebtRepository;
        this.prisma = prisma;
        this.logger = new common_1.Logger(CreateTransactionUseCase_1.name);
    }
    async execute(createTransactionDto) {
        this.logger.log(`Creating transaction with type: ${createTransactionDto.type} and ${createTransactionDto.items.length} items`);
        return await this.prisma.$transaction(async (tx) => {
            let customer = null;
            let supplier = null;
            if (createTransactionDto.type === client_1.TransactionType.SELL) {
                if (!createTransactionDto.customerId) {
                    throw new common_1.BadRequestException('Customer ID is required for SELL transactions');
                }
                customer = await tx.customer.findUnique({
                    where: { id: createTransactionDto.customerId },
                });
                if (!customer) {
                    throw new common_1.NotFoundException(`Customer with ID ${createTransactionDto.customerId} not found`);
                }
            }
            else if (createTransactionDto.type === client_1.TransactionType.BUY) {
                if (!createTransactionDto.supplierId) {
                    throw new common_1.BadRequestException('Supplier ID is required for BUY transactions');
                }
                const supplierId = typeof createTransactionDto.supplierId === 'string'
                    ? parseInt(createTransactionDto.supplierId, 10)
                    : createTransactionDto.supplierId;
                supplier = await tx.supplier.findUnique({
                    where: { id: supplierId },
                });
                if (!supplier) {
                    throw new common_1.NotFoundException(`Supplier with ID ${supplierId} not found`);
                }
            }
            const itemIds = createTransactionDto.items.map((item) => item.itemId);
            const [items, stocks] = await Promise.all([
                tx.item.findMany({
                    where: { id: { in: itemIds } },
                }),
                tx.stock.findMany({
                    where: { itemId: { in: itemIds } },
                }),
            ]);
            const itemMap = new Map(items.map((item) => [item.id, item]));
            const stockMap = new Map(stocks.map((stock) => [stock.itemId, stock]));
            let calculatedTotalAmount = 0;
            const validatedItems = [];
            const stockUpdates = [];
            const stocksToCreate = [];
            for (const itemDto of createTransactionDto.items) {
                const item = itemMap.get(itemDto.itemId);
                if (!item) {
                    throw new common_1.NotFoundException(`Item with ID ${itemDto.itemId} not found`);
                }
                if (createTransactionDto.type === client_1.TransactionType.SELL) {
                    if (!item.isSellable) {
                        throw new common_1.BadRequestException(`Item with ID ${itemDto.itemId} is not sellable`);
                    }
                    const stock = stockMap.get(itemDto.itemId);
                    if (!stock) {
                        throw new common_1.NotFoundException(`No stock found for item with ID ${itemDto.itemId}`);
                    }
                    if (stock.quantity < itemDto.quantity) {
                        throw new common_1.BadRequestException(`Not enough stock for item ${item.name}. Requested: ${itemDto.quantity}, Available: ${stock.quantity}`);
                    }
                    const totalAmount = itemDto.totalAmount || itemDto.unitPrice * itemDto.quantity;
                    validatedItems.push({
                        ...itemDto,
                        stockId: stock.id,
                        totalAmount,
                    });
                    stockUpdates.push({
                        id: stock.id,
                        quantity: stock.quantity - itemDto.quantity,
                    });
                }
                else if (createTransactionDto.type === client_1.TransactionType.BUY) {
                    const stock = stockMap.get(itemDto.itemId);
                    const totalAmount = itemDto.totalAmount || itemDto.unitPrice * itemDto.quantity;
                    if (!stock) {
                        const newStock = {
                            itemId: itemDto.itemId,
                            quantity: itemDto.quantity,
                            refillAlert: false,
                            lastRefilled: createTransactionDto.date || new Date(),
                        };
                        stocksToCreate.push(newStock);
                        validatedItems.push({
                            ...itemDto,
                            stockId: null,
                            totalAmount,
                        });
                    }
                    else {
                        validatedItems.push({
                            ...itemDto,
                            stockId: stock.id,
                            totalAmount,
                        });
                        stockUpdates.push({
                            id: stock.id,
                            quantity: stock.quantity + itemDto.quantity,
                            lastRefilled: createTransactionDto.date || new Date(),
                        });
                    }
                }
                calculatedTotalAmount +=
                    validatedItems[validatedItems.length - 1].totalAmount;
            }
            const totalAmount = createTransactionDto.totalAmount || calculatedTotalAmount;
            const transactionDate = createTransactionDto.date || new Date();
            const transactionData = {
                type: createTransactionDto.type,
                customerId: createTransactionDto.customerId,
                supplierId: createTransactionDto.supplierId,
                totalAmount,
                date: transactionDate,
            };
            const transaction = await tx.transaction.create({
                data: transactionData,
            });
            const createdStocks = [];
            if (stocksToCreate.length > 0) {
                for (const stockData of stocksToCreate) {
                    const createdStock = await tx.stock.create({
                        data: stockData,
                    });
                    createdStocks.push(createdStock);
                }
                let createdStockIndex = 0;
                for (let i = 0; i < validatedItems.length; i++) {
                    if (validatedItems[i].stockId === null) {
                        validatedItems[i].stockId = createdStocks[createdStockIndex].id;
                        createdStockIndex++;
                    }
                }
            }
            const transactionItemsData = validatedItems.map((item) => ({
                transactionId: transaction.id,
                itemId: item.itemId,
                stockId: item.stockId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalAmount: item.totalAmount,
            }));
            await tx.transactionItem.createMany({
                data: transactionItemsData,
            });
            await Promise.all(stockUpdates.map((update) => tx.stock.update({
                where: { id: update.id },
                data: {
                    quantity: update.quantity,
                    ...(update.lastRefilled && { lastRefilled: update.lastRefilled }),
                },
            })));
            let debt = null;
            if (createTransactionDto.type === client_1.TransactionType.SELL &&
                createTransactionDto.createDebt &&
                createTransactionDto.debt) {
                if (createTransactionDto.debt.amount > totalAmount) {
                    throw new common_1.BadRequestException(`Debt amount (${createTransactionDto.debt.amount}) cannot exceed transaction total amount (${totalAmount})`);
                }
                const debtData = {
                    ...createTransactionDto.debt,
                    transactionId: transaction.id,
                    customerId: createTransactionDto.debt.customerId ||
                        createTransactionDto.customerId,
                };
                debt = await tx.debt.create({ data: debtData });
            }
            let supplierDebt = null;
            if (createTransactionDto.type === client_1.TransactionType.BUY &&
                createTransactionDto.createSupplierDebt &&
                createTransactionDto.supplierDebt) {
                if (createTransactionDto.supplierDebt.amount > totalAmount) {
                    throw new common_1.BadRequestException(`Supplier debt amount (${createTransactionDto.supplierDebt.amount}) cannot exceed transaction total amount (${totalAmount})`);
                }
                const supplierDebtData = {
                    ...createTransactionDto.supplierDebt,
                    transactionId: transaction.id,
                    supplierId: createTransactionDto.supplierDebt.supplierId ||
                        createTransactionDto.supplierId,
                    dueDate: new Date(createTransactionDto.supplierDebt.dueDate),
                };
                supplierDebt = await tx.supplierDebt.create({ data: supplierDebtData });
            }
            const transactionItems = await tx.transactionItem.findMany({
                where: { transactionId: transaction.id },
                include: {
                    item: true,
                    stock: true,
                },
            });
            return {
                ...transaction,
                customer,
                supplier,
                debt: debt ? [debt] : [],
                supplierDebt: supplierDebt ? [supplierDebt] : [],
                transactionItems,
            };
        });
    }
};
exports.CreateTransactionUseCase = CreateTransactionUseCase;
exports.CreateTransactionUseCase = CreateTransactionUseCase = CreateTransactionUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(repository_tokens_1.TRANSACTION_REPOSITORY)),
    __param(1, (0, common_1.Inject)(repository_tokens_1.TRANSACTION_ITEM_REPOSITORY)),
    __param(2, (0, common_1.Inject)(repository_tokens_1.ITEM_REPOSITORY)),
    __param(3, (0, common_1.Inject)(repository_tokens_1.STOCK_REPOSITORY)),
    __param(4, (0, common_1.Inject)(repository_tokens_1.CUSTOMER_REPOSITORY)),
    __param(5, (0, common_1.Inject)(repository_tokens_1.DEBT_REPOSITORY)),
    __param(6, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_REPOSITORY)),
    __param(7, (0, common_1.Inject)(repository_tokens_1.SUPPLIER_DEBT_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, prisma_service_1.PrismaService])
], CreateTransactionUseCase);
//# sourceMappingURL=create-transaction.use-case.js.map