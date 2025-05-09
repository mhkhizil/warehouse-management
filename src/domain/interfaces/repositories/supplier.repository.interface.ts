import { Supplier } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export interface SupplierFilter {
  name?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  take?: number;
  skip?: number;
}

export interface ISupplierRepository extends IBaseRepository<Supplier, number> {
  findByEmail(email: string): Promise<Supplier | null>;
  findByPhone(phone: string): Promise<Supplier | null>;
  findWithFilters(
    filter: SupplierFilter,
  ): Promise<{ suppliers: Supplier[]; total: number }>;
  findWithDebts(): Promise<Supplier[]>;
}
