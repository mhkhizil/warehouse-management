import { Injectable } from '@nestjs/common';
import { SupplierDebt, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ISupplierDebtRepository,
  SupplierDebtFilter,
} from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';

@Injectable()
export class SupplierDebtRepository implements ISupplierDebtRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<SupplierDebt>): Promise<SupplierDebt> {
    return this.prisma.supplierDebt.create({
      data: data as Prisma.SupplierDebtCreateInput,
    });
  }

  async findById(id: number): Promise<SupplierDebt | null> {
    return this.prisma.supplierDebt.findUnique({
      where: { id },
      include: {
        supplier: true,
        transaction: true,
      },
    });
  }

  async findAll(): Promise<SupplierDebt[]> {
    return this.prisma.supplierDebt.findMany({
      include: {
        supplier: true,
      },
    });
  }

  async update(id: number, data: Partial<SupplierDebt>): Promise<SupplierDebt> {
    return this.prisma.supplierDebt.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.supplierDebt.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findBySupplierId(supplierId: number): Promise<SupplierDebt[]> {
    return this.prisma.supplierDebt.findMany({
      where: { supplierId },
      include: {
        transaction: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findByTransactionId(
    transactionId: number,
  ): Promise<SupplierDebt | null> {
    return this.prisma.supplierDebt.findFirst({
      where: { transactionId },
      include: {
        supplier: true,
        transaction: true,
      },
    });
  }

  async findUnsettled(): Promise<SupplierDebt[]> {
    return this.prisma.supplierDebt.findMany({
      where: {
        isSettled: false,
      },
      include: {
        supplier: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findUnsettledBySupplierId(supplierId: number): Promise<SupplierDebt[]> {
    return this.prisma.supplierDebt.findMany({
      where: {
        supplierId,
        isSettled: false,
      },
      include: {
        transaction: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findWithFilters(
    filter: SupplierDebtFilter,
  ): Promise<{ debts: SupplierDebt[]; total: number }> {
    const where: Prisma.SupplierDebtWhereInput = {};

    if (filter.supplierId !== undefined) {
      where.supplierId = filter.supplierId;
    }

    if (filter.isSettled !== undefined) {
      where.isSettled = filter.isSettled;
    }

    if (filter.dueBefore) {
      where.dueDate = {
        ...((where.dueDate as any) || {}),
        lte: filter.dueBefore,
      };
    }

    if (filter.dueAfter) {
      where.dueDate = {
        ...((where.dueDate as any) || {}),
        gte: filter.dueAfter,
      };
    }

    const [debts, total] = await Promise.all([
      this.prisma.supplierDebt.findMany({
        where,
        take: filter.take,
        skip: filter.skip,
        include: {
          supplier: true,
          transaction: true,
        },
        orderBy: {
          dueDate: 'asc',
        },
      }),
      this.prisma.supplierDebt.count({ where }),
    ]);

    return { debts, total };
  }

  async updateSettlementStatus(
    id: number,
    isSettled: boolean,
  ): Promise<SupplierDebt> {
    return this.prisma.supplierDebt.update({
      where: { id },
      data: {
        isSettled,
      },
    });
  }
}
 