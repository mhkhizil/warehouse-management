import { PaginationFilter } from './pagination.filter';

export enum CustomerSortBy {
  NAME = 'name',
  PHONE = 'phone',
  EMAIL = 'email',
  ADDRESS = 'address',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class CustomerFilter extends PaginationFilter {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  hasDebts?: boolean;
  isActive?: boolean;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  sortBy?: CustomerSortBy;
  sortOrder?: SortOrder;

  constructor(partial: Partial<CustomerFilter>) {
    super(partial);
    Object.assign(this, partial);
  }
}
