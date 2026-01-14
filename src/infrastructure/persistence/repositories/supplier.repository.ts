import { Injectable } from '@nestjs/common';
import { Supplier, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { SupplierFilter } from '../../../domain/filters/supplier.filter';

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
    const {
      name,
      email,
      phone,
      address,
      contactPerson,
      isActive,
      skip = 0,
      take = 10,
      sortBy,
      sortOrder,
    } = filter;

    const where: Prisma.SupplierWhereInput = {
      isActive: isActive !== undefined ? isActive : true,
      ...(name && {
        name: { contains: name, mode: 'insensitive' },
      }),
      ...(email && {
        email: { contains: email, mode: 'insensitive' },
      }),
      ...(phone && {
        phone: { contains: phone },
      }),
      ...(address && {
        address: { contains: address, mode: 'insensitive' },
      }),
      ...(contactPerson && {
        contactPerson: { contains: contactPerson, mode: 'insensitive' },
      }),
    };

    // Build order by clause
    const orderBy: any = {};
    const sortField = sortBy || 'createdAt';
    const sortDirection = sortOrder || 'desc';

    // Map SupplierSortBy enum values to Prisma field names
    const fieldMapping = {
      name: 'name',
      phone: 'phone',
      email: 'email',
      address: 'address',
      contactPerson: 'contactPerson',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    const prismaFieldName = fieldMapping[sortField] || 'createdAt';
    orderBy[prismaFieldName] = sortDirection;

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        take: Number(take),
        skip: Number(skip),
        include: {
          debt: true,
        },
        orderBy: orderBy,
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
    const {
      name,
      email,
      phone,
      address,
      contactPerson,
      skip = 0,
      take = 10,
      sortBy,
      sortOrder,
    } = filter;

    const where: Prisma.SupplierWhereInput = {
      isActive: false, // Always filter for deleted suppliers
      ...(name && {
        name: { contains: name, mode: 'insensitive' },
      }),
      ...(email && {
        email: { contains: email, mode: 'insensitive' },
      }),
      ...(phone && {
        phone: { contains: phone },
      }),
      ...(address && {
        address: { contains: address, mode: 'insensitive' },
      }),
      ...(contactPerson && {
        contactPerson: { contains: contactPerson, mode: 'insensitive' },
      }),
    };

    // Build order by clause
    const orderBy: any = {};
    const sortField = sortBy || 'createdAt';
    const sortDirection = sortOrder || 'desc';

    // Map SupplierSortBy enum values to Prisma field names
    const fieldMapping = {
      name: 'name',
      phone: 'phone',
      email: 'email',
      address: 'address',
      contactPerson: 'contactPerson',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    const prismaFieldName = fieldMapping[sortField] || 'createdAt';
    orderBy[prismaFieldName] = sortDirection;

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        take: Number(take),
        skip: Number(skip),
        include: {
          debt: true,
        },
        orderBy: orderBy,
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
