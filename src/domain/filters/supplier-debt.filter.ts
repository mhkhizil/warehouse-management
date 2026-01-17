import { PaginationFilter } from './pagination.filter';

export enum SupplierDebtSortBy {
  SUPPLIER = 'supplier',
  AMOUNT = 'amount',
  DUE_DATE = 'dueDate',
  IS_SETTLED = 'isSettled',
  SETTLED_DATE = 'settledDate',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SupplierDebtFilter extends PaginationFilter {
  supplierId?: number;
  supplierName?: string;
  isSettled?: boolean;
  dueBefore?: Date;
  dueAfter?: Date;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  updatedAtFrom?: Date;
  updatedAtTo?: Date;
  overdue?: boolean; // Filter for debts past due date (not settled)
  farFromDue?: boolean; // Filter for debts due within 3 days (not settled)
  dueToday?: boolean; // Filter for debts due today (not settled)
  sortBy?: SupplierDebtSortBy;
  sortOrder?: SortOrder;

  constructor(partial: Partial<SupplierDebtFilter>) {
    super(partial);
    Object.assign(this, partial);
  }
}
