import { PaginationFilter } from './pagination.filter';

export enum DebtSortBy {
  CUSTOMER = 'customer',
  AMOUNT = 'amount',
  DUE_DATE = 'dueDate',
  IS_SETTLED = 'isSettled',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class DebtFilter extends PaginationFilter {
  customerId?: number;
  isSettled?: boolean;
  alertSent?: boolean;
  dueBefore?: Date;
  dueAfter?: Date;

  // NEW FILTERS FOR DEBT CATEGORIZATION
  minAmount?: number; // For filtering positive debts
  maxAmount?: number; // For filtering negative debts (credits)
  includeRemarks?: string[]; // For filtering by remarks content
  excludeRemarks?: string[]; // For excluding certain remarks

  // Sorting (similar to supplier-debts)
  sortBy?: DebtSortBy;
  sortOrder?: SortOrder;

  constructor(partial: Partial<DebtFilter>) {
    super(partial);
    Object.assign(this, partial);
  }
}
