import { Injectable } from '@nestjs/common';
import { Debt, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  DebtFilter,
  IDebtRepository,
} from '../../../domain/interfaces/repositories/debt.repository.interface';

@Injectable()
export class DebtRepository implements IDebtRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Debt>): Promise<Debt> {
    return this.prisma.debt.create({
      data: data as any,
      include: {
        customer: true,
        transaction: true,
      },
    });
  }

  async findById(id: number): Promise<Debt | null> {
    return this.prisma.debt.findUnique({
      where: { id },
      include: {
        customer: true,
        transaction: true,
      },
    });
  }

  async findAll(): Promise<Debt[]> {
    return this.prisma.debt.findMany({
      include: {
        customer: true,
        transaction: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async update(id: number, data: Partial<Debt>): Promise<Debt> {
    return this.prisma.debt.update({
      where: { id },
      data,
      include: {
        customer: true,
        transaction: true,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.debt.delete({
      where: { id },
    });
    return true;
  }

  async findByCustomerId(customerId: number): Promise<Debt[]> {
    return this.prisma.debt.findMany({
      where: { customerId },
      include: {
        transaction: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findByCustomerName(customerName: string): Promise<Debt[]> {
    return this.prisma.debt.findMany({
      where: {
        customer: {
          name: {
            contains: customerName,
            mode: 'insensitive',
          },
        },
      },
      include: {
        customer: true,
        transaction: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findByTransactionId(transactionId: number): Promise<Debt | null> {
    return this.prisma.debt.findFirst({
      where: { transactionId },
      include: {
        customer: true,
        transaction: true,
      },
    });
  }

  async markAsSettled(id: number): Promise<Debt> {
    return this.prisma.debt.update({
      where: { id },
      data: {
        isSettled: true,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
        transaction: true,
      },
    });
  }

  async markAlertSent(id: number): Promise<Debt> {
    return this.prisma.debt.update({
      where: { id },
      data: {
        alertSent: true,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
      },
    });
  }

  async findOverdueDebts(): Promise<Debt[]> {
    const now = new Date();

    return this.prisma.debt.findMany({
      where: {
        dueDate: { lt: now },
        isSettled: false,
      },
      include: {
        customer: true,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findWithFilters(
    filter: DebtFilter,
  ): Promise<{ debts: Debt[]; total: number }> {
    const {
      customerId,
      isSettled,
      alertSent,
      dueBefore,
      dueAfter,
      overdue,
      farFromDue,
      dueToday,
      minAmount,
      maxAmount,
      includeRemarks,
      excludeRemarks,
      sortBy,
      sortOrder,
      skip = 0,
      take = 10,
    } = filter;

    const where: Prisma.DebtWhereInput = {
      ...(customerId && { customerId }),
      ...(isSettled !== undefined && { isSettled }),
      ...(alertSent !== undefined && { alertSent }),

      // Handle overdue filter (debts past due date, not settled)
      ...(overdue === true && {
        dueDate: {
          lt: (() => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
          })(),
        },
        isSettled: false,
      }),

      // Handle farFromDue filter (debts due within 14 days, not settled)
      ...(farFromDue === true && {
        dueDate: {
          gte: (() => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
          })(),
          lte: (() => {
            const now = new Date();
            const todayStart = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            );
            const fourteenDaysLater = new Date(todayStart);
            fourteenDaysLater.setDate(fourteenDaysLater.getDate() + 14);
            return fourteenDaysLater;
          })(),
        },
        isSettled: false,
      }),

      // Handle dueToday filter (debts due today, not settled)
      ...(dueToday === true && {
        dueDate: {
          gte: (() => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
          })(),
          lt: (() => {
            const now = new Date();
            const todayStart = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            );
            const tomorrowStart = new Date(todayStart);
            tomorrowStart.setDate(tomorrowStart.getDate() + 1);
            return tomorrowStart;
          })(),
        },
        isSettled: false,
      }),

      ...((dueBefore || dueAfter) && {
        dueDate: {
          ...(dueBefore && { lte: dueBefore }),
          ...(dueAfter && { gte: dueAfter }),
        },
      }),
      ...((minAmount !== undefined || maxAmount !== undefined) && {
        amount: {
          ...(minAmount !== undefined && { gte: minAmount }),
          ...(maxAmount !== undefined && { lte: maxAmount }),
        },
      }),
      ...(includeRemarks &&
        includeRemarks.length > 0 && {
          OR: includeRemarks.map((remark) => ({
            remarks: {
              contains: remark,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          })),
        }),
      ...(excludeRemarks &&
        excludeRemarks.length > 0 && {
          AND: excludeRemarks.map((remark) => ({
            NOT: {
              remarks: {
                contains: remark,
                mode: 'insensitive' as Prisma.QueryMode,
              },
            },
          })),
        }),
    };

    // Build orderBy (like supplier-debts)
    const sortField = sortBy || 'dueDate';
    const sortDirection = sortOrder || 'asc';

    let orderBy: any;
    if (sortField === 'customer') {
      orderBy = { customer: { name: sortDirection } };
    } else {
      const fieldMapping: Record<string, string> = {
        amount: 'amount',
        dueDate: 'dueDate',
        isSettled: 'isSettled',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      };
      const prismaFieldName = fieldMapping[sortField] || 'dueDate';
      orderBy = { [prismaFieldName]: sortDirection };
    }

    const [debts, total] = await Promise.all([
      this.prisma.debt.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          customer: true,
          transaction: true,
        },
      }),
      this.prisma.debt.count({ where }),
    ]);

    return { debts, total };
  }
}
