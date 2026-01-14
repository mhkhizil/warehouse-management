import { Refund, RefundStatus } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export interface IRefundRepository extends IBaseRepository<Refund, number> {
  findByTransactionId(transactionId: number): Promise<Refund[]>;
  findByCustomerId(customerId: number): Promise<Refund[]>;
  findByStatus(status: RefundStatus): Promise<Refund[]>;
  updateStatus(
    id: number,
    status: RefundStatus,
    processedBy?: number,
  ): Promise<Refund>;
  findWithAllRelations(id: number): Promise<Refund | null>;
}

