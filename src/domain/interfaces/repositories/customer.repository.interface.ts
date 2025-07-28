import { Customer } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
import { CustomerSortBy, SortOrder } from '../../filters/customer.filter';

export type CustomerFilter = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  hasDebts?: boolean;
  isActive?: boolean;
  skip?: number;
  take?: number;
  sortBy?: CustomerSortBy;
  sortOrder?: SortOrder;
};

export interface ICustomerRepository extends IBaseRepository<Customer, number> {
  findByEmail(email: string): Promise<Customer | null>;
  findByPhone(phone: string): Promise<Customer | null>;
  findByEmailForValidation(email: string): Promise<Customer | null>;
  findByPhoneForValidation(phone: string): Promise<Customer | null>;
  findWithDebts(): Promise<Customer[]>;
  findDeleted(): Promise<Customer[]>;
  findDeletedWithFilters(
    filter: CustomerFilter,
  ): Promise<{ customers: Customer[]; total: number }>;
  findByIdForRestore(id: number): Promise<Customer | null>;
  restore(id: number): Promise<Customer>;
  findWithFilters(
    filter: CustomerFilter,
  ): Promise<{ customers: Customer[]; total: number }>;
}
