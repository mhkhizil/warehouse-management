import { Injectable } from '@nestjs/common';
import { Refund, RefundStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IRefundRepository } from '../../../domain/interfaces/repositories/refund.repository.interface';

@Injectable()
export class RefundRepository implements IRefundRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Refund>): Promise<Refund> {
    return this.prisma.refund.create({
      data: data as any,
      include: {
        originalTransaction: true,
        refundTransaction: true,
        customer: true,
        refundItems: {
          include: {
            originalTransactionItem: {
              include: {
                item: true,
                stock: true,
              },
            },
          },
        },
        exchangeItems: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Refund[]> {
    return this.prisma.refund.findMany({
      include: {
        originalTransaction: true,
        refundTransaction: true,
        customer: true,
        refundItems: {
          include: {
            originalTransactionItem: {
              include: {
                item: true,
                stock: true,
              },
            },
          },
        },
        exchangeItems: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<Refund | null> {
    return this.prisma.refund.findUnique({
      where: { id },
      include: {
        originalTransaction: true,
        refundTransaction: true,
        customer: true,
        refundItems: {
          include: {
            originalTransactionItem: {
              include: {
                item: true,
                stock: true,
              },
            },
          },
        },
        exchangeItems: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Partial<Refund>): Promise<Refund> {
    return this.prisma.refund.update({
      where: { id },
      data: data as any,
      include: {
        originalTransaction: true,
        refundTransaction: true,
        customer: true,
        refundItems: {
          include: {
            originalTransactionItem: {
              include: {
                item: true,
                stock: true,
              },
            },
          },
        },
        exchangeItems: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.refund.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByTransactionId(transactionId: number): Promise<Refund[]> {
    return this.prisma.refund.findMany({
      where: { originalTransactionId: transactionId },
      include: {
        originalTransaction: true,
        refundTransaction: true,
        customer: true,
        refundItems: {
          include: {
            originalTransactionItem: {
              include: {
                item: true,
                stock: true,
              },
            },
          },
        },
        exchangeItems: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCustomerId(customerId: number): Promise<Refund[]> {
    return this.prisma.refund.findMany({
      where: { customerId },
      include: {
        originalTransaction: true,
        refundTransaction: true,
        customer: true,
        refundItems: {
          include: {
            originalTransactionItem: {
              include: {
                item: true,
                stock: true,
              },
            },
          },
        },
        exchangeItems: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStatus(status: RefundStatus): Promise<Refund[]> {
    return this.prisma.refund.findMany({
      where: { status },
      include: {
        originalTransaction: true,
        refundTransaction: true,
        customer: true,
        refundItems: {
          include: {
            originalTransactionItem: {
              include: {
                item: true,
                stock: true,
              },
            },
          },
        },
        exchangeItems: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    id: number,
    status: RefundStatus,
    processedBy?: number,
  ): Promise<Refund> {
    const updateData: Prisma.RefundUpdateInput = {
      status,
    };

    if (status === RefundStatus.PROCESSED) {
      updateData.processedAt = new Date();
      if (processedBy) {
        updateData.processedBy = processedBy;
      }
    }

    return this.prisma.refund.update({
      where: { id },
      data: updateData,
      include: {
        originalTransaction: true,
        refundTransaction: true,
        customer: true,
        refundItems: {
          include: {
            originalTransactionItem: {
              include: {
                item: true,
                stock: true,
              },
            },
          },
        },
        exchangeItems: {
          include: {
            item: true,
          },
        },
      },
    });
  }

  async findWithAllRelations(id: number): Promise<Refund | null> {
    return this.findById(id);
  }
}

