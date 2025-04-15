import { Injectable } from '@nestjs/common';
import { Prisma, Staff } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  IStaffRepository,
  StaffFilter,
} from '../../../domain/interfaces/repositories/staff.repository.interface';

@Injectable()
export class StaffRepository implements IStaffRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Staff>): Promise<Staff> {
    return this.prisma.staff.create({
      data: data as any,
    });
  }

  async findById(id: number): Promise<Staff | null> {
    return this.prisma.staff.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findAll(): Promise<Staff[]> {
    return this.prisma.staff.findMany({
      include: { user: true },
    });
  }

  async update(id: number, data: Partial<Staff>): Promise<Staff> {
    return this.prisma.staff.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.prisma.staff.delete({
      where: { id },
    });
    return true;
  }

  async findByUserId(userId: number): Promise<Staff | null> {
    return this.prisma.staff.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async findWithFilters(
    filter: StaffFilter,
  ): Promise<{ staff: Staff[]; total: number }> {
    const { fullName, phone, skip = 0, take = 10 } = filter;

    const where: Prisma.StaffWhereInput = {
      ...(fullName && {
        fullName: { contains: fullName, mode: Prisma.QueryMode.insensitive },
      }),
      ...(phone && {
        phone: { contains: phone, mode: Prisma.QueryMode.insensitive },
      }),
    };

    const [staff, total] = await Promise.all([
      this.prisma.staff.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      }),
      this.prisma.staff.count({ where }),
    ]);

    return { staff, total };
  }
}
