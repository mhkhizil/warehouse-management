import { Injectable } from '@nestjs/common';
import { Supplier, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ISupplierRepository,
  SupplierFilter,
} from '../../../domain/interfaces/repositories/supplier.repository.interface';

@Injectable()
export class SupplierRepository implements ISupplierRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Supplier>): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: data as Prisma.SupplierCreateInput,
    });
  }

  async findById(id: number): Promise<Supplier | null> {
    // Ensure id is a number and convert if needed
    const supplierId = typeof id === 'string' ? parseInt(id, 10) : id;
    console.log(
      `Repository: Finding supplier with ID: ${supplierId}, type: ${typeof supplierId}`,
    );

    try {
      const result = await this.prisma.supplier.findFirst({
        where: {
          id: supplierId,
          isActive: true,
        },
        include: {
          debt: true,
          transactions: true,
        },
      });

      console.log(
        `Repository: Supplier search result: ${result ? 'Found' : 'Not found'}`,
      );
      if (result) {
        console.log(
          `Repository: Supplier details: ID=${result.id}, Name=${result.name}, isActive=${result.isActive}`,
        );
      }
      return result;
    } catch (error) {
      console.error('Repository: Error finding supplier:', error);
      throw error;
    }
  }

  async findAll(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({
      where: {
        isActive: true,
      },
      include: {
        debt: true,
      },
    });
  }

  async update(id: number, data: Partial<Supplier>): Promise<Supplier> {
    return this.prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.prisma.supplier.update({
      where: { id },
      data: { isActive: false },
    });
    return !!result;
  }

  async findByEmail(email: string): Promise<Supplier | null> {
    return this.prisma.supplier.findFirst({
      where: {
        email,
        isActive: true,
      },
    });
  }

  async findByPhone(phone: string): Promise<Supplier | null> {
    return this.prisma.supplier.findFirst({
      where: {
        phone,
        isActive: true,
      },
    });
  }

  async findWithFilters(
    filter: SupplierFilter,
  ): Promise<{ suppliers: Supplier[]; total: number }> {
    const where: Prisma.SupplierWhereInput = {
      isActive: filter.isActive !== undefined ? filter.isActive : true,
    };

    if (filter.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }

    if (filter.email) {
      where.email = { contains: filter.email, mode: 'insensitive' };
    }

    if (filter.phone) {
      where.phone = { contains: filter.phone };
    }

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        take: filter.take,
        skip: filter.skip,
        include: {
          debt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return { suppliers, total };
  }

  async findWithDebts(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({
      where: {
        isActive: true,
        debt: {
          some: {
            isSettled: false,
          },
        },
      },
      include: {
        debt: {
          where: {
            isSettled: false,
          },
        },
      },
    });
  }

  async findDeletedWithFilters(
    filter: SupplierFilter,
  ): Promise<{ suppliers: Supplier[]; total: number }> {
    const where: Prisma.SupplierWhereInput = {
      isActive: false, // Always filter for deleted suppliers
    };

    if (filter.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }

    if (filter.email) {
      where.email = { contains: filter.email, mode: 'insensitive' };
    }

    if (filter.phone) {
      where.phone = { contains: filter.phone };
    }

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        take: filter.take,
        skip: filter.skip,
        include: {
          debt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return { suppliers, total };
  }

  async restore(id: number): Promise<Supplier> {
    return this.prisma.supplier.update({
      where: { id },
      data: { isActive: true },
      include: {
        debt: true,
      },
    });
  }
}
