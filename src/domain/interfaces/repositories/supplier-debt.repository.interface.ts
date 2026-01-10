import { SupplierDebt } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
import { SupplierDebtFilter } from '../../filters/supplier-debt.filter';

export interface ISupplierDebtRepository
  extends IBaseRepository<SupplierDebt, number> {
  findBySupplierId(supplierId: number): Promise<SupplierDebt[]>;
  findBySupplierName(supplierName: string): Promise<SupplierDebt[]>;
  findByTransactionId(transactionId: number): Promise<SupplierDebt | null>;
  findUnsettled(): Promise<SupplierDebt[]>;
  findUnsettledBySupplierId(supplierId: number): Promise<SupplierDebt[]>;
  findWithFilters(
    filter: SupplierDebtFilter,
  ): Promise<{ debts: SupplierDebt[]; total: number }>;
  updateSettlementStatus(id: number, isSettled: boolean): Promise<SupplierDebt>;
}
 