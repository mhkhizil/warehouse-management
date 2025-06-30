import { Injectable } from '@nestjs/common';
import { Prisma, Stock } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  IStockRepository,
  StockFilter,
} from '../../../domain/interfaces/repositories/stock.repository.interface';

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Stock>): Promise<Stock> {
    return this.prisma.stock.create({
      data: data as any,
      include: {
        item: true,
      },
    });
  }

  async findById(id: number): Promise<Stock | null> {
    return this.prisma.stock.findUnique({
      where: { id },
      include: {
        item: true,
        transactionItems: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            item: true,
            transaction: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Stock[]> {
    return this.prisma.stock.findMany({
      include: {
        item: true,
      },
    });
  }

  async update(id: number, data: Partial<Stock>): Promise<Stock> {
    return this.prisma.stock.update({
      where: { id },
      data,
      include: {
        item: true,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.stock.delete({
      where: { id },
    });
    return true;
  }

  async findByItemId(itemId: number): Promise<Stock | null> {
    return this.prisma.stock.findFirst({
      where: { itemId },
      include: {
        item: true,
        transactionItems: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            item: true,
            transaction: true,
          },
        },
      },
    });
  }

  async updateQuantity(id: number, quantity: number): Promise<Stock> {
    return this.prisma.stock.update({
      where: { id },
      data: {
        quantity,
        lastRefilled: new Date(),
      },
      include: {
        item: true,
      },
    });
  }

  async findLowStock(threshold?: number): Promise<Stock[]> {
    return this.prisma.stock.findMany({
      where: {
        refillAlert: true,
        ...(threshold !== undefined && { quantity: { lte: threshold } }),
      },
      include: {
        item: true,
      },
    });
  }

  async findWithFilters(
    filter: StockFilter,
  ): Promise<{ stocks: Stock[]; total: number }> {
    const {
      refillAlert,
      itemId,
      minQuantity,
      maxQuantity,
      skip = 0,
      take = 10,
    } = filter;

    const where: Prisma.StockWhereInput = {
      ...(refillAlert !== undefined && { refillAlert }),
      ...(itemId !== undefined && { itemId }),
      ...((minQuantity !== undefined || maxQuantity !== undefined) && {
        quantity: {
          ...(minQuantity !== undefined && { gte: minQuantity }),
          ...(maxQuantity !== undefined && { lte: maxQuantity }),
        },
      }),
    };

    const [stocks, total] = await Promise.all([
      this.prisma.stock.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
        include: {
          item: true,
        },
      }),
      this.prisma.stock.count({ where }),
    ]);

    return { stocks, total };
  }
}
