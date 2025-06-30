import { Injectable } from '@nestjs/common';
import { TransactionItem } from '@prisma/client';
import { ITransactionItemRepository } from '../../../domain/interfaces/repositories/transaction-item.repository.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionItemRepository implements ITransactionItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<TransactionItem>): Promise<TransactionItem> {
    return this.prisma.transactionItem.create({
      data: data as any,
      include: {
        item: true,
        stock: true,
        transaction: true,
      },
    });
  }

  async findById(id: number): Promise<TransactionItem | null> {
    return this.prisma.transactionItem.findUnique({
      where: { id },
      include: {
        item: true,
        stock: true,
        transaction: true,
      },
    });
  }

  async findAll(): Promise<TransactionItem[]> {
    return this.prisma.transactionItem.findMany({
      include: {
        item: true,
        stock: true,
        transaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: number,
    data: Partial<TransactionItem>,
  ): Promise<TransactionItem> {
    return this.prisma.transactionItem.update({
      where: { id },
      data: data as any,
      include: {
        item: true,
        stock: true,
        transaction: true,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.transactionItem.delete({
      where: { id },
    });
    return true;
  }

  async findByTransactionId(transactionId: number): Promise<TransactionItem[]> {
    return this.prisma.transactionItem.findMany({
      where: { transactionId },
      include: {
        item: true,
        stock: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByItemId(itemId: number): Promise<TransactionItem[]> {
    return this.prisma.transactionItem.findMany({
      where: { itemId },
      include: {
        item: true,
        stock: true,
        transaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMany(
    items: Partial<TransactionItem>[],
  ): Promise<TransactionItem[]> {
    // Since Prisma doesn't support createMany with includes, we create them one by one
    const createdItems: TransactionItem[] = [];

    for (const item of items) {
      const createdItem = await this.create(item);
      createdItems.push(createdItem);
    }

    return createdItems;
  }

  async deleteByTransactionId(transactionId: number): Promise<void> {
    await this.prisma.transactionItem.deleteMany({
      where: { transactionId },
    });
  }
}
