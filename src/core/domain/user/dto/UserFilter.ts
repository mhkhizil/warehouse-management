import { UserRole } from '@src/core/common/type/UserEnum';
import { BaseFilterSchema } from 'src/core/common/schema/BaseFilterSchema';

export enum UserSortBy {
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
  ROLE = 'role',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class UserFilter extends BaseFilterSchema {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  sortBy?: UserSortBy;
  sortOrder?: SortOrder;

  constructor(
    name: string,
    role: UserRole,
    email: string,
    phone: string,
    sortBy: UserSortBy,
    sortOrder: SortOrder,
    take: number,
    skip: number,
  ) {
    super(take, skip);
    this.name = name || '';
    this.email = email || '';
    this.phone = phone || '';
    this.role = role;
    this.sortBy = sortBy || UserSortBy.CREATED_AT;
    this.sortOrder = sortOrder || SortOrder.DESC;
  }
}
