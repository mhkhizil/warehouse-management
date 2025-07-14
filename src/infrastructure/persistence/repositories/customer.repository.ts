import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ICustomerRepository,
  CustomerFilter,
} from '../../../domain/interfaces/repositories/customer.repository.interface';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Customer>): Promise<Customer> {
    return this.prisma.customer.create({
      data: data as any,
    });
  }

  async findById(id: number): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        debt: true,
        transactions: {
          take: 5,
          orderBy: { date: 'desc' },
        },
      },
    });
  }

  async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      where: {
        isActive: true,
      },
      include: {
        debt: true,
      },
    });
  }

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data,
      include: {
        debt: true,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });
    return !!result;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: {
        email,
        isActive: true,
      },
      include: {
        debt: true,
      },
    });
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: {
        phone,
        isActive: true,
      },
      include: {
        debt: true,
      },
    });
  }

  // New validation methods that don't filter by isActive
  async findByEmailForValidation(email: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: {
        email,
      },
    });
  }

  async findByPhoneForValidation(phone: string): Promise<Customer | null> {
    return this.prisma.customer.findFirst({
      where: {
        phone,
      },
    });
  }

  async findWithDebts(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
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

  async findWithFilters(
    filter: CustomerFilter,
  ): Promise<{ customers: Customer[]; total: number }> {
    const {
      name,
      phone,
      email,
      hasDebt,
      skip = 0,
      take = 10,
      isActive,
    } = filter;

    const where: Prisma.CustomerWhereInput = {
      isActive: isActive !== undefined ? isActive : true,
      ...(name && {
        name: { contains: name, mode: Prisma.QueryMode.insensitive },
      }),
      ...(phone && {
        phone: { contains: phone, mode: Prisma.QueryMode.insensitive },
      }),
      ...(email && {
        email: { contains: email, mode: Prisma.QueryMode.insensitive },
      }),
      ...(hasDebt !== undefined &&
        hasDebt && {
          debt: {
            some: {
              isSettled: false,
            },
          },
        }),
    };

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          debt: true,
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { customers, total };
  }
}
