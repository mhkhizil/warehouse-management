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
  sortBy?: SupplierDebtSortBy;
  sortOrder?: SortOrder;

  constructor(partial: Partial<SupplierDebtFilter>) {
    super(partial);
    Object.assign(this, partial);
  }
}

