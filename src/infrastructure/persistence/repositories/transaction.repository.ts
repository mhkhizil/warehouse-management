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
    return this.prisma.transaction.create({
      data: data as any,
      include: {
        item: true,
        customer: true,
        stock: true,
        debt: true,
      },
    });
  }

  async findById(id: number): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        item: true,
        customer: true,
        stock: true,
        debt: true,
      },
    });
  }

  async findAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      include: {
        item: true,
        customer: true,
        stock: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async update(id: number, data: Partial<Transaction>): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data,
      include: {
        item: true,
        customer: true,
        stock: true,
        debt: true,
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
        item: true,
        stock: true,
        debt: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findByItemId(itemId: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { itemId },
      include: {
        item: true,
        customer: true,
        stock: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findWithFilters(
    filter: TransactionFilter,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const {
      type,
      itemId,
      customerId,
      stockId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      skip = 0,
      take = 10,
    } = filter;

    const where: Prisma.TransactionWhereInput = {
      ...(type && { type }),
      ...(itemId && { itemId }),
      ...(customerId && { customerId }),
      ...(stockId && { stockId }),
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
          item: true,
          customer: true,
          stock: true,
          debt: true,
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
        item: true,
        customer: true,
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
        item: true,
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
