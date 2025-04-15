import { PaginationFilter } from './pagination.filter';

export class CustomerFilter extends PaginationFilter {
  name?: string;
  phone?: string;
  email?: string;
  hasDebts?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;

  constructor(partial: Partial<CustomerFilter>) {
    super(partial);
    Object.assign(this, partial);
  }
}
