import { Injectable } from '@nestjs/common';
import { Prisma, Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ITransactionRepository,
  TransactionFilter,
} from '../../../domain/interfaces/repositories/transaction.repository.interface';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Transaction>): Promise<Transaction> {
    // Create a copy of the data and remove the non-Transaction model fields
    const {
      createDebt,
      debt,
      createSupplierDebt,
      supplierDebt,
      items,
      ...transactionData
    } = data as any;

    return this.prisma.transaction.create({
      data: transactionData,
      include: {
        customer: true,
        supplier: true,
        debt: true,
        supplierDebt: true,
        transactionItems: {
          include: {
            item: true,
            stock: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        supplier: true,
        debt: true,
        supplierDebt: true,
        transactionItems: {
          include: {
            item: true,
            stock: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      include: {
        customer: true,
        supplier: true,
        debt: true,
        supplierDebt: true,
        transactionItems: {
          include: {
            item: true,
            stock: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async update(id: number, data: Partial<Transaction>): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data,
      include: {
        customer: true,
        supplier: true,
        debt: true,
        supplierDebt: true,
        transactionItems: {
          include: {
            item: true,
            stock: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.transaction.delete({
      where: { id },
    });
    return true;
  }

  async findByCustomerId(customerId: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { customerId },
      include: {
        customer: true,
        supplier: true,
        debt: true,
        supplierDebt: true,
        transactionItems: {
          include: {
            item: true,
            stock: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findBySupplierId(supplierId: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { supplierId },
      include: {
        customer: true,
        supplier: true,
        debt: true,
        supplierDebt: true,
        transactionItems: {
          include: {
            item: true,
            stock: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findWithFilters(
    filter: TransactionFilter,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const {
      type,
      customerId,
      supplierId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      skip = 0,
      take = 10,
    } = filter;

    const where: Prisma.TransactionWhereInput = {
      ...(type && { type }),
      ...(customerId && { customerId }),
      ...(supplierId && { supplierId }),
      ...((startDate || endDate) && {
        date: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      }),
      ...((minAmount !== undefined || maxAmount !== undefined) && {
        totalAmount: {
          ...(minAmount !== undefined && { gte: minAmount }),
          ...(maxAmount !== undefined && { lte: maxAmount }),
        },
      }),
    };

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: {
          customer: true,
          supplier: true,
          debt: true,
          supplierDebt: true,
          transactionItems: {
            include: {
              item: true,
              stock: true,
            },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { transactions, total };
  }

  async getSalesReport(
    startDate: Date,
    endDate: Date,
  ): Promise<{ totalSales: number; transactions: Transaction[] }> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: 'SELL',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        debt: true,
        transactionItems: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const totalSales = transactions.reduce(
      (sum, transaction) => sum + transaction.totalAmount,
      0,
    );

    return { totalSales, transactions };
  }

  async getPurchaseReport(
    startDate: Date,
    endDate: Date,
  ): Promise<{ totalPurchases: number; transactions: Transaction[] }> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: 'BUY',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        supplier: true,
        supplierDebt: true,
        transactionItems: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const totalPurchases = transactions.reduce(
      (sum, transaction) => sum + transaction.totalAmount,
      0,
    );

    return { totalPurchases, transactions };
  }
}
