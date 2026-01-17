import { Debt } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export type DebtFilter = {
  customerId?: number;
  isSettled?: boolean;
  alertSent?: boolean;
  dueBefore?: Date;
  dueAfter?: Date;
  overdue?: boolean; // Filter for debts past due date (not settled)
  farFromDue?: boolean; // Filter for debts due within 14 days (not settled)
  dueToday?: boolean; // Filter for debts due today (not settled)
  skip?: number;
  take?: number;
  // NEW FILTERS FOR DEBT CATEGORIZATION
  minAmount?: number; // For filtering positive debts
  maxAmount?: number; // For filtering negative debts (credits)
  includeRemarks?: string[]; // For filtering by remarks content
  excludeRemarks?: string[]; // For excluding certain remarks
  // Sorting (like supplier-debts)
  sortBy?:
    | 'customer'
    | 'amount'
    | 'dueDate'
    | 'isSettled'
    | 'createdAt'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

export interface IDebtRepository extends IBaseRepository<Debt, number> {
  findByCustomerId(customerId: number): Promise<Debt[]>;
  findByCustomerName(customerName: string): Promise<Debt[]>;
  findByTransactionId(transactionId: number): Promise<Debt | null>;
  findWithFilters(
    filter: DebtFilter,
  ): Promise<{ debts: Debt[]; total: number }>;
  markAsSettled(id: number): Promise<Debt>;
  markAlertSent(id: number): Promise<Debt>;
  findOverdueDebts(): Promise<Debt[]>;
}
