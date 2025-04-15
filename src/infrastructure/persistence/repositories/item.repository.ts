import { Injectable } from '@nestjs/common';
import { Item, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  IItemRepository,
  ItemFilter,
} from '../../../domain/interfaces/repositories/item.repository.interface';

@Injectable()
export class ItemRepository implements IItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Item>): Promise<Item> {
    return this.prisma.item.create({
      data: data as any,
    });
  }

  async findById(id: number): Promise<Item | null> {
    return this.prisma.item.findUnique({
      where: { id },
      include: {
        stock: true,
        subItems: true,
      },
    });
  }

  async findAll(): Promise<Item[]> {
    return this.prisma.item.findMany({
      include: {
        stock: true,
        subItems: true,
      },
    });
  }

  async update(id: number, data: Partial<Item>): Promise<Item> {
    return this.prisma.item.update({
      where: { id },
      data,
      include: {
        stock: true,
        subItems: true,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.item.delete({
      where: { id },
    });
    return true;
  }

  async findByName(name: string): Promise<Item | null> {
    return this.prisma.item.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      include: {
        stock: true,
        subItems: true,
      },
    });
  }

  async findSubItems(parentItemId: number): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: { parentItemId },
      include: { stock: true },
    });
  }

  async findWithFilters(
    filter: ItemFilter,
  ): Promise<{ items: Item[]; total: number }> {
    const { name, brand, type, isSellable, skip = 0, take = 10 } = filter;

    const where: Prisma.ItemWhereInput = {
      ...(name && {
        name: { contains: name, mode: Prisma.QueryMode.insensitive },
      }),
      ...(brand && {
        brand: { contains: brand, mode: Prisma.QueryMode.insensitive },
      }),
      ...(type && {
        type: { contains: type, mode: Prisma.QueryMode.insensitive },
      }),
      ...(isSellable !== undefined && { isSellable }),
    };

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          stock: true,
          subItems: true,
        },
      }),
      this.prisma.item.count({ where }),
    ]);

    return { items, total };
  }
}
