import { PaginationFilter } from './pagination.filter';

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

  constructor(partial: Partial<DebtFilter>) {
    super(partial);
    Object.assign(this, partial);
  }
}
