import { PaginationFilter } from './pagination.filter';

export enum SupplierSortBy {
  NAME = 'name',
  PHONE = 'phone',
  EMAIL = 'email',
  ADDRESS = 'address',
  CONTACT_PERSON = 'contactPerson',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SupplierFilter extends PaginationFilter {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  isActive?: boolean;
  sortBy?: SupplierSortBy;
  sortOrder?: SortOrder;

  constructor(partial: Partial<SupplierFilter>) {
    super(partial);
    Object.assign(this, partial);
  }
}
