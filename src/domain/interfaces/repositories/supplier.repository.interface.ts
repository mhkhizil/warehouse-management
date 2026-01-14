import { Supplier } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
import { SupplierFilter } from '../../filters/supplier.filter';

export interface ISupplierRepository extends IBaseRepository<Supplier, number> {
  findByEmail(email: string): Promise<Supplier | null>;
  findByPhone(phone: string): Promise<Supplier | null>;
  findWithFilters(
    filter: SupplierFilter,
  ): Promise<{ suppliers: Supplier[]; total: number }>;
  findWithDebts(): Promise<Supplier[]>;
  findDeletedWithFilters(
    filter: SupplierFilter,
  ): Promise<{ suppliers: Supplier[]; total: number }>;
  restore(id: number): Promise<Supplier>;
}
