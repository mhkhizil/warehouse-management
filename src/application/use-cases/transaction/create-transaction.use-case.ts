import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';
import {
  TRANSACTION_REPOSITORY,
  TRANSACTION_ITEM_REPOSITORY,
  ITEM_REPOSITORY,
  STOCK_REPOSITORY,
  CUSTOMER_REPOSITORY,
  DEBT_REPOSITORY,
  SUPPLIER_REPOSITORY,
  SUPPLIER_DEBT_REPOSITORY,
} from '../../../domain/constants/repository.tokens';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ITransactionItemRepository } from '../../../domain/interfaces/repositories/transaction-item.repository.interface';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { CreateTransactionDto } from '../../dtos/transaction/create-transaction.dto';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(TRANSACTION_ITEM_REPOSITORY)
    private readonly transactionItemRepository: ITransactionItemRepository,
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: IItemRepository,
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
    @Inject(SUPPLIER_DEBT_REPOSITORY)
    private readonly supplierDebtRepository: ISupplierDebtRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    this.logger.log(
      `Creating transaction with type: ${createTransactionDto.type} and ${createTransactionDto.items.length} items`,
    );

    // Use Prisma transaction for atomic operations and better performance
    return await this.prisma.$transaction(async (tx) => {
      // Validate customer or supplier based on transaction type
      let customer = null;
      let supplier = null;

      if (createTransactionDto.type === TransactionType.SELL) {
        if (!createTransactionDto.customerId) {
          throw new BadRequestException(
            'Customer ID is required for SELL transactions',
          );
        }

        customer = await tx.customer.findUnique({
          where: { id: createTransactionDto.customerId },
        });
        if (!customer) {
          throw new NotFoundException(
            `Customer with ID ${createTransactionDto.customerId} not found`,
          );
        }
      } else if (createTransactionDto.type === TransactionType.BUY) {
        if (!createTransactionDto.supplierId) {
          throw new BadRequestException(
            'Supplier ID is required for BUY transactions',
          );
        }

        const supplierId =
          typeof createTransactionDto.supplierId === 'string'
            ? parseInt(createTransactionDto.supplierId, 10)
            : createTransactionDto.supplierId;

        supplier = await tx.supplier.findUnique({
          where: { id: supplierId },
        });
        if (!supplier) {
          throw new NotFoundException(
            `Supplier with ID ${supplierId} not found`,
          );
        }
      }

      // Batch fetch all items and stocks in parallel
      const itemIds = createTransactionDto.items.map((item) => item.itemId);
      const [items, stocks] = await Promise.all([
        tx.item.findMany({
          where: { id: { in: itemIds } },
        }),
        tx.stock.findMany({
          where: { itemId: { in: itemIds } },
        }),
      ]);

      // Create maps for quick lookup
      const itemMap = new Map(items.map((item) => [item.id, item]));
      const stockMap = new Map(stocks.map((stock) => [stock.itemId, stock]));

      // Validate all items and calculate total amount
      let calculatedTotalAmount = 0;
      const validatedItems = [];
      const stockUpdates = [];
      const stocksToCreate = [];

      for (const itemDto of createTransactionDto.items) {
        // Validate item exists
        const item = itemMap.get(itemDto.itemId);
        if (!item) {
          throw new NotFoundException(
            `Item with ID ${itemDto.itemId} not found`,
          );
        }

        if (createTransactionDto.type === TransactionType.SELL) {
          // Check if item is sellable
          if (!item.isSellable) {
            throw new BadRequestException(
              `Item with ID ${itemDto.itemId} is not sellable`,
            );
          }

          // Check stock availability
          const stock = stockMap.get(itemDto.itemId);
          if (!stock) {
            throw new NotFoundException(
              `No stock found for item with ID ${itemDto.itemId}`,
            );
          }

          if (stock.quantity < itemDto.quantity) {
            throw new BadRequestException(
              `Not enough stock for item ${item.name}. Requested: ${itemDto.quantity}, Available: ${stock.quantity}`,
            );
          }

          const totalAmount =
            itemDto.totalAmount || itemDto.unitPrice * itemDto.quantity;
          validatedItems.push({
            ...itemDto,
            stockId: stock.id,
            totalAmount,
            hasWarranty: itemDto.hasWarranty || false,
            warrantyDurationMonths: itemDto.warrantyDurationMonths,
            warrantyStartDate: itemDto.warrantyStartDate,
            warrantyEndDate: itemDto.warrantyEndDate,
            warrantyDescription: itemDto.warrantyDescription,
          });

          // Prepare stock update
          stockUpdates.push({
            id: stock.id,
            quantity: stock.quantity - itemDto.quantity,
          });
        } else if (createTransactionDto.type === TransactionType.BUY) {
          // Find or prepare stock creation for BUY transactions
          const stock = stockMap.get(itemDto.itemId);
          const totalAmount =
            itemDto.totalAmount || itemDto.unitPrice * itemDto.quantity;

          if (!stock) {
            // Prepare stock creation
            const newStock = {
              itemId: itemDto.itemId,
              quantity: itemDto.quantity,
              refillAlert: false,
              lastRefilled: createTransactionDto.date || new Date(),
            };
            stocksToCreate.push(newStock);

            validatedItems.push({
              ...itemDto,
              stockId: null, // Will be set after stock creation
              totalAmount,
              hasWarranty: itemDto.hasWarranty || false,
              warrantyDurationMonths: itemDto.warrantyDurationMonths,
              warrantyStartDate: itemDto.warrantyStartDate,
              warrantyEndDate: itemDto.warrantyEndDate,
              warrantyDescription: itemDto.warrantyDescription,
            });
          } else {
            validatedItems.push({
              ...itemDto,
              stockId: stock.id,
              totalAmount,
              hasWarranty: itemDto.hasWarranty || false,
              warrantyDurationMonths: itemDto.warrantyDurationMonths,
              warrantyStartDate: itemDto.warrantyStartDate,
              warrantyEndDate: itemDto.warrantyEndDate,
              warrantyDescription: itemDto.warrantyDescription,
            });

            // Prepare stock update
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

      // Use provided total amount or calculated amount
      const totalAmount =
        createTransactionDto.totalAmount || calculatedTotalAmount;

      // Set transaction date if not provided
      const transactionDate = createTransactionDto.date || new Date();

      // Create the main transaction
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

      // Create missing stocks first (for BUY transactions)
      const createdStocks = [];
      if (stocksToCreate.length > 0) {
        for (const stockData of stocksToCreate) {
          const createdStock = await tx.stock.create({
            data: stockData,
          });
          createdStocks.push(createdStock);
        }

        // Update validatedItems with new stock IDs
        let createdStockIndex = 0;
        for (let i = 0; i < validatedItems.length; i++) {
          if (validatedItems[i].stockId === null) {
            validatedItems[i].stockId = createdStocks[createdStockIndex].id;
            createdStockIndex++;
          }
        }
      }

      // Batch create transaction items
      const transactionItemsData = validatedItems.map((item) => {
        const baseData = {
          transactionId: transaction.id,
          itemId: item.itemId,
          stockId: item.stockId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalAmount: item.totalAmount,
        };

        // Add warranty fields if provided
        if (item.hasWarranty) {
          const warrantyStartDate = item.warrantyStartDate
            ? new Date(item.warrantyStartDate)
            : transactionDate;

          let warrantyEndDate = null;
          if (item.warrantyEndDate) {
            warrantyEndDate = new Date(item.warrantyEndDate);
          } else if (item.warrantyDurationMonths) {
            warrantyEndDate = new Date(warrantyStartDate);
            warrantyEndDate.setMonth(
              warrantyEndDate.getMonth() + item.warrantyDurationMonths,
            );
          }

          return {
            ...baseData,
            hasWarranty: true,
            warrantyDurationMonths: item.warrantyDurationMonths,
            warrantyStartDate,
            warrantyEndDate,
            warrantyDescription: item.warrantyDescription || null,
          };
        }

        return {
          ...baseData,
          hasWarranty: false,
          warrantyDurationMonths: null,
          warrantyStartDate: null,
          warrantyEndDate: null,
          warrantyDescription: null,
        };
      });

      await tx.transactionItem.createMany({
        data: transactionItemsData,
      });

      // Batch update stock quantities
      await Promise.all(
        stockUpdates.map((update) =>
          tx.stock.update({
            where: { id: update.id },
            data: {
              quantity: update.quantity,
              ...(update.lastRefilled && { lastRefilled: update.lastRefilled }),
            },
          }),
        ),
      );

      // Create debt if needed
      let debt = null;
      if (
        createTransactionDto.type === TransactionType.SELL &&
        createTransactionDto.createDebt &&
        createTransactionDto.debt
      ) {
        // Validate debt amount doesn't exceed total transaction amount
        if (createTransactionDto.debt.amount > totalAmount) {
          throw new BadRequestException(
            `Debt amount (${createTransactionDto.debt.amount}) cannot exceed transaction total amount (${totalAmount})`,
          );
        }

        const debtData = {
          ...createTransactionDto.debt,
          transactionId: transaction.id,
          customerId:
            createTransactionDto.debt.customerId ||
            createTransactionDto.customerId,
        };
        debt = await tx.debt.create({ data: debtData });
      }

      // Create supplier debt if needed
      let supplierDebt = null;
      if (
        createTransactionDto.type === TransactionType.BUY &&
        createTransactionDto.createSupplierDebt &&
        createTransactionDto.supplierDebt
      ) {
        // Validate supplier debt amount doesn't exceed total transaction amount
        if (createTransactionDto.supplierDebt.amount > totalAmount) {
          throw new BadRequestException(
            `Supplier debt amount (${createTransactionDto.supplierDebt.amount}) cannot exceed transaction total amount (${totalAmount})`,
          );
        }

        const supplierDebtData = {
          ...createTransactionDto.supplierDebt,
          transactionId: transaction.id,
          supplierId:
            createTransactionDto.supplierDebt.supplierId ||
            createTransactionDto.supplierId,
          dueDate: new Date(createTransactionDto.supplierDebt.dueDate),
        };
        supplierDebt = await tx.supplierDebt.create({ data: supplierDebtData });
      }

      // Fetch transaction items with relations for the response
      const transactionItems = await tx.transactionItem.findMany({
        where: { transactionId: transaction.id },
        include: {
          item: true,
          stock: true,
        },
      });

      // Build the complete response manually (much faster than findById with all relations)
      return {
        ...transaction,
        customer,
        supplier,
        debt: debt ? [debt] : [],
        supplierDebt: supplierDebt ? [supplierDebt] : [],
        transactionItems,
      } as Transaction;
    });
  }
}
