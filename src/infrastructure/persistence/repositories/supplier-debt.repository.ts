import { Injectable } from '@nestjs/common';
import { SupplierDebt, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { SupplierDebtFilter } from '../../../domain/filters/supplier-debt.filter';

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

  async findBySupplierName(supplierName: string): Promise<SupplierDebt[]> {
    return this.prisma.supplierDebt.findMany({
      where: {
        supplier: {
          name: {
            contains: supplierName,
            mode: 'insensitive',
          },
        },
      },
      include: {
        supplier: true,
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

    if (filter.supplierName) {
      where.supplier = {
        name: {
          contains: filter.supplierName,
          mode: 'insensitive',
        },
      };
    }

    if (filter.isSettled !== undefined) {
      where.isSettled = filter.isSettled;
    }

    // Handle overdue filter (debts past due date, not settled)
    if (filter.overdue === true) {
      const now = new Date();
      // Set to start of today for accurate comparison
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      where.dueDate = { lt: todayStart };
      where.isSettled = false;
    }

    // Handle farFromDue filter (debts due within 3 days, not settled)
    if (filter.farFromDue === true) {
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const fourteenDaysLater = new Date(todayStart);
      fourteenDaysLater.setDate(fourteenDaysLater.getDate() + 14);
      // Due date is >= today and <= today + 3 days
      where.dueDate = {
        gte: todayStart,
        lte: fourteenDaysLater,
      };
      where.isSettled = false;
    }

    // Handle dueToday filter (debts due today, not settled)
    if (filter.dueToday === true) {
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);
      // Due date is >= today start and < tomorrow start
      where.dueDate = {
        gte: todayStart,
        lt: todayEnd,
      };
      where.isSettled = false;
    }

    if (filter.dueBefore || filter.dueAfter) {
      where.dueDate = {
        ...(filter.dueBefore && { lte: filter.dueBefore }),
        ...(filter.dueAfter && { gte: filter.dueAfter }),
      };
    }

    if (filter.createdAtFrom || filter.createdAtTo) {
      where.createdAt = {
        ...(filter.createdAtFrom && { gte: filter.createdAtFrom }),
        ...(filter.createdAtTo && { lte: filter.createdAtTo }),
      };
    }

    if (filter.updatedAtFrom || filter.updatedAtTo) {
      where.updatedAt = {
        ...(filter.updatedAtFrom && { gte: filter.updatedAtFrom }),
        ...(filter.updatedAtTo && { lte: filter.updatedAtTo }),
      };
    }

    // Build order by clause
    const sortField = filter.sortBy || 'dueDate';
    const sortDirection = filter.sortOrder || 'asc';

    // Handle sorting by supplier name (requires nested orderBy)
    let orderBy: any;
    if (sortField === 'supplier') {
      orderBy = {
        supplier: {
          name: sortDirection,
        },
      };
    } else {
      // Map SupplierDebtSortBy enum values to Prisma field names
      const fieldMapping = {
        amount: 'amount',
        dueDate: 'dueDate',
        isSettled: 'isSettled',
        settledDate: 'settledDate',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      };

      const prismaFieldName = fieldMapping[sortField] || 'dueDate';
      orderBy = { [prismaFieldName]: sortDirection };
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
        orderBy: orderBy,
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
