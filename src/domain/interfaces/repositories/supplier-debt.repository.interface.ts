import { SupplierDebt } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export interface SupplierDebtFilter {
  supplierId?: number;
  isSettled?: boolean;
  dueBefore?: Date;
  dueAfter?: Date;
  take?: number;
  skip?: number;
}

export interface ISupplierDebtRepository
  extends IBaseRepository<SupplierDebt, number> {
  findBySupplierId(supplierId: number): Promise<SupplierDebt[]>;
  findByTransactionId(transactionId: number): Promise<SupplierDebt | null>;
  findUnsettled(): Promise<SupplierDebt[]>;
  findUnsettledBySupplierId(supplierId: number): Promise<SupplierDebt[]>;
  findWithFilters(
    filter: SupplierDebtFilter,
  ): Promise<{ debts: SupplierDebt[]; total: number }>;
  updateSettlementStatus(id: number, isSettled: boolean): Promise<SupplierDebt>;
}
 