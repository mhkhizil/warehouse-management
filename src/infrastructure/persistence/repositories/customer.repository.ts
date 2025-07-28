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

  async findDeleted(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      where: {
        isActive: false,
      },
      include: {
        debt: true,
      },
    });
  }

a  async findDeletedWithFilters(
    filter: CustomerFilter,
  ): Promise<{ customers: Customer[]; total: number }> {
    const {
      name,
      phone,
      email,
      address,
      hasDebts,
      skip = 0,
      take = 10,
      sortBy,
      sortOrder,
    } = filter;

    const where: Prisma.CustomerWhereInput = {
      isActive: false, // Always filter for deleted customers
      ...(name && {
        name: { contains: name, mode: Prisma.QueryMode.insensitive },
      }),
      ...(phone && {
        phone: { contains: phone, mode: Prisma.QueryMode.insensitive },
      }),
      ...(email && {
        email: { contains: email, mode: Prisma.QueryMode.insensitive },
      }),
      ...(address && {
        address: { contains: address, mode: Prisma.QueryMode.insensitive },
      }),
      ...(hasDebts !== undefined && {
        debt: hasDebts
          ? {
              some: {
                isSettled: false,
              },
            }
          : {
              none: {
                isSettled: false,
              },
            },
      }),
    };

    // Build order by clause
    const orderBy: any = {};
    const sortField = sortBy || 'createdAt';
    const sortDirection = sortOrder || 'desc';

    // Map CustomerSortBy enum values to Prisma field names
    const fieldMapping = {
      name: 'name',
      phone: 'phone',
      email: 'email',
      address: 'address',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    const prismaFieldName = fieldMapping[sortField] || 'createdAt';
    orderBy[prismaFieldName] = sortDirection;

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: orderBy,
        include: {
          debt: true,
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { customers, total };
  }

  async findByIdForRestore(id: number): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        debt: true,
      },
    });
  }

  async restore(id: number): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data: { isActive: true },
      include: {
        debt: true,
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
      address,
      hasDebts,
      skip = 0,
      take = 10,
      isActive,
      sortBy,
      sortOrder,
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
      ...(address && {
        address: { contains: address, mode: Prisma.QueryMode.insensitive },
      }),
      ...(hasDebts !== undefined && {
        debt: hasDebts
          ? {
              some: {
                isSettled: false,
              },
            }
          : {
              none: {
                isSettled: false,
              },
            },
      }),
    };

    // Build order by clause
    const orderBy: any = {};
    const sortField = sortBy || 'createdAt';
    const sortDirection = sortOrder || 'desc';

    // Map CustomerSortBy enum values to Prisma field names
    const fieldMapping = {
      name: 'name',
      phone: 'phone',
      email: 'email',
      address: 'address',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    const prismaFieldName = fieldMapping[sortField] || 'createdAt';
    orderBy[prismaFieldName] = sortDirection;

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: orderBy,
        include: {
          debt: true,
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { customers, total };
  }
}
