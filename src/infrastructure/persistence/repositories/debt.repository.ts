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
      skip = 0,
      take = 10,
    } = filter;

    const where: Prisma.DebtWhereInput = {
      ...(customerId && { customerId }),
      ...(isSettled !== undefined && { isSettled }),
      ...(alertSent !== undefined && { alertSent }),
      ...((dueBefore || dueAfter) && {
        dueDate: {
          ...(dueBefore && { lte: dueBefore }),
          ...(dueAfter && { gte: dueAfter }),
        },
      }),
    };

    const [debts, total] = await Promise.all([
      this.prisma.debt.findMany({
        where,
        skip,
        take,
        orderBy: { dueDate: 'asc' },
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
