import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/persistence/prisma/prisma.service';
import {
  SUPPLIER_REPOSITORY,
  ITEM_REPOSITORY,
  STOCK_REPOSITORY,
  TRANSACTION_REPOSITORY,
  SUPPLIER_DEBT_REPOSITORY,
} from '../../../domain/constants/repository.tokens';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';

export interface BuyFromSupplierDto {
  supplierId: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
  createDebt?: boolean;
  debtDueDate?: string;
  debtRemarks?: string;
}

@Injectable()
export class BuyFromSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private supplierRepository: ISupplierRepository,
    @Inject(ITEM_REPOSITORY)
    private itemRepository: IItemRepository,
    @Inject(STOCK_REPOSITORY)
    private stockRepository: IStockRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private transactionRepository: ITransactionRepository,
    @Inject(SUPPLIER_DEBT_REPOSITORY)
    private supplierDebtRepository: ISupplierDebtRepository,
    private prisma: PrismaService,
  ) {}

  async execute(data: BuyFromSupplierDto): Promise<Transaction> {
    // Check if supplier exists
    const supplier = await this.supplierRepository.findById(data.supplierId);
    if (!supplier) {
      throw new NotFoundException(
        `Supplier with ID ${data.supplierId} not found`,
      );
    }

    // Check if item exists
    const item = await this.itemRepository.findById(data.itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID ${data.itemId} not found`);
    }

    // Validate quantity and price
    if (data.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }
    if (data.unitPrice <= 0) {
      throw new BadRequestException('Unit price must be greater than zero');
    }

    // Calculate total amount
    const totalAmount = data.quantity * data.unitPrice;

    // Use transaction to ensure data consistency
    return this.prisma.$transaction(async (prismaClient) => {
      // Find or create stock for this item
      let stock = await this.stockRepository.findByItemId(data.itemId);

      if (!stock) {
        // Create new stock entry if it doesn't exist
        stock = await this.stockRepository.create({
          itemId: data.itemId,
          quantity: 0,
          refillAlert: false,
          lastRefilled: new Date(),
        });
      }

      // Update stock quantity
      await this.stockRepository.update(stock.id, {
        quantity: stock.quantity + data.quantity,
        lastRefilled: new Date(),
      });

      // Create transaction record with typed data
      const transaction = await this.transactionRepository.create({
        type: TransactionType.BUY,
        itemId: data.itemId,
        stockId: stock.id,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalAmount: totalAmount,
        date: new Date(),
        customerId: null,
        supplierId: data.supplierId,
      });

      // Create debt record if requested
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
}
