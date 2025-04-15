import { TransactionType } from '@prisma/client';
import { PaginationFilter } from './pagination.filter';

export class TransactionFilter extends PaginationFilter {
  type?: TransactionType;
  itemId?: number;
  customerId?: number;
  stockId?: number;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;

  constructor(partial: Partial<TransactionFilter>) {
    super(partial);
    Object.assign(this, partial);
  }
}
