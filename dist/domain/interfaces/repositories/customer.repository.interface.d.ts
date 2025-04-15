import { Customer } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
export type CustomerFilter = {
    name?: string;
    phone?: string;
    email?: string;
    hasDebt?: boolean;
    skip?: number;
    take?: number;
};
export interface ICustomerRepository extends IBaseRepository<Customer, number> {
    findByEmail(email: string): Promise<Customer | null>;
    findByPhone(phone: string): Promise<Customer | null>;
    findWithFilters(filter: CustomerFilter): Promise<{
        customers: Customer[];
        total: number;
    }>;
    findWithDebts(): Promise<Customer[]>;
}
