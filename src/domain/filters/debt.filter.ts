import { PaginationFilter } from './pagination.filter';

export class DebtFilter extends PaginationFilter {
  customerId?: number;
  isSettled?: boolean;
  alertSent?: boolean;
  dueBefore?: Date;
  dueAfter?: Date;

  constructor(partial: Partial<DebtFilter>) {
    super(partial);
    Object.assign(this, partial);
  }
}
