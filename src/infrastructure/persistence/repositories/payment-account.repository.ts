import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IPaymentAccountRepository,
  PaymentAccountFilter,
} from '../../../domain/interfaces/repositories/payment-account.repository.interface';
import { CreatePaymentAccountDto } from '../../../application/dtos/payment-account/create-payment-account.dto';
import { UpdatePaymentAccountDto } from '../../../application/dtos/payment-account/update-payment-account.dto';

@Injectable()
export class PaymentAccountRepository implements IPaymentAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePaymentAccountDto): Promise<any> {
    return await this.prisma.paymentAccount.create({
      data: {
        accountName: data.accountName,
        accountType: data.accountType,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        accountHolder: data.accountHolder,
        description: data.description,
        isActive: data.isActive ?? true,
        balance: data.balance ?? 0,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<any> {
    return await this.prisma.paymentAccount.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });
  }

  async findAll(filter?: PaymentAccountFilter): Promise<any[]> {
    const where: any = {};

    if (filter) {
      if (filter.isActive !== undefined) {
        where.isActive = filter.isActive;
      }

      if (filter.accountType) {
        where.accountType = {
          contains: filter.accountType,
          mode: 'insensitive',
        };
      }

      if (filter.bankName) {
        where.bankName = {
          contains: filter.bankName,
          mode: 'insensitive',
        };
      }

      if (filter.search) {
        where.OR = [
          {
            accountName: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            accountType: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            bankName: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            accountHolder: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
        ];
      }
    }

    return await this.prisma.paymentAccount.findMany({
      where,
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: [
        { isActive: 'desc' }, // Active accounts first
        { accountName: 'asc' },
      ],
    });
  }

  async findActive(): Promise<any[]> {
    return await this.prisma.paymentAccount.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: { accountName: 'asc' },
    });
  }

  async update(id: number, data: UpdatePaymentAccountDto): Promise<any> {
    return await this.prisma.paymentAccount.update({
      where: { id },
      data: {
        accountName: data.accountName,
        accountType: data.accountType,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        accountHolder: data.accountHolder,
        description: data.description,
        isActive: data.isActive,
        balance: data.balance,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.paymentAccount.delete({
      where: { id },
    });
  }

  async count(filter?: PaymentAccountFilter): Promise<number> {
    const where: any = {};

    if (filter) {
      if (filter.isActive !== undefined) {
        where.isActive = filter.isActive;
      }

      if (filter.accountType) {
        where.accountType = {
          contains: filter.accountType,
          mode: 'insensitive',
        };
      }

      if (filter.bankName) {
        where.bankName = {
          contains: filter.bankName,
          mode: 'insensitive',
        };
      }

      if (filter.search) {
        where.OR = [
          {
            accountName: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            accountType: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            bankName: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            accountHolder: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
        ];
      }
    }

    return await this.prisma.paymentAccount.count({ where });
  }

  async findWithTransactionCount(): Promise<any[]> {
    return await this.prisma.paymentAccount.findMany({
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: [{ isActive: 'desc' }, { accountName: 'asc' }],
    });
  }
}
