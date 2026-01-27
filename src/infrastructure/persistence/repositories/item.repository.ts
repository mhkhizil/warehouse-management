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
      where: {
        id,
        isDeleted: false, // Only return non-deleted items
      },
      include: {
        stock: true,
        subItems: {
          where: {
            isDeleted: false, // Only include non-deleted sub-items
          },
        },
      },
    });
  }

  async findAll(): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: {
        isDeleted: false, // Only return non-deleted items
      },
      include: {
        stock: true,
        subItems: {
          where: {
            isDeleted: false, // Only include non-deleted sub-items
          },
        },
      },
    });
  }

  async update(id: number, data: Partial<Item>): Promise<Item> {
    return this.prisma.item.update({
      where: {
        id,
        isDeleted: false, // Only update non-deleted items
      },
      data,
      include: {
        stock: true,
        subItems: {
          where: {
            isDeleted: false, // Only include non-deleted sub-items
          },
        },
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    // Instead of physical delete, perform soft delete by setting isDeleted to true
    await this.prisma.item.update({
      where: { id },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });
    return true;
  }

  async findByName(name: string): Promise<Item | null> {
    return this.prisma.item.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        isDeleted: false, // Only return non-deleted items
      },
      include: {
        stock: true,
        subItems: {
          where: {
            isDeleted: false, // Only include non-deleted sub-items
          },
        },
      },
    });
  }

  async findSubItems(parentItemId: number): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: {
        parentItemId,
        isDeleted: false, // Only return non-deleted items
      },
      include: {
        stock: true,
      },
    });
  }

  async findWithFilters(
    filter: ItemFilter,
  ): Promise<{ items: Item[]; total: number }> {
    const { name, brand, type, isSellable, skip = 0, take = 10 } = filter;

    const where: Prisma.ItemWhereInput = {
      isDeleted: false, // Only return non-deleted items
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
          subItems: {
            where: {
              isDeleted: false, // Only include non-deleted sub-items
            },
          },
        },
      }),
      this.prisma.item.count({ where }),
    ]);

    return { items, total };
  }

  /**
   * Find items that are eligible to be parent items.
   * Eligible items are:
   * - Not deleted (isDeleted: false)
   * - Not the item being edited (if excludeId is provided)
   * - Not a descendant of the item being edited (prevents circular references)
   *
   * @param excludeId - Optional ID of item to exclude (and its descendants) when editing
   */
  async findEligibleParentItems(excludeId?: number): Promise<Item[]> {
    // If excludeId is provided, we need to exclude it and all its descendants
    let excludeIds: number[] = [];

    if (excludeId) {
      excludeIds = await this.getDescendantIds(excludeId);
      excludeIds.push(excludeId); // Include the item itself
    }

    return this.prisma.item.findMany({
      where: {
        isDeleted: false,
        ...(excludeIds.length > 0 && {
          id: { notIn: excludeIds },
        }),
      },
      orderBy: { name: 'asc' },
      include: {
        stock: true,
        parentItem: {
          select: {
            id: true,
            name: true,
          },
        },
        subItems: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Recursively get all descendant IDs of an item.
   * Used to prevent circular references when setting parent items.
   */
  private async getDescendantIds(itemId: number): Promise<number[]> {
    const descendants: number[] = [];

    const children = await this.prisma.item.findMany({
      where: {
        parentItemId: itemId,
        isDeleted: false,
      },
      select: { id: true },
    });

    for (const child of children) {
      descendants.push(child.id);
      const childDescendants = await this.getDescendantIds(child.id);
      descendants.push(...childDescendants);
    }

    return descendants;
  }
}
