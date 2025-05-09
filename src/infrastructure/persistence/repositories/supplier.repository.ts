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
    return this.prisma.supplier.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        debt: true,
        transactions: true,
      },
    });
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
}
