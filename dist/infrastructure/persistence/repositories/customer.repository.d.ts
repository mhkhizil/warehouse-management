import { Customer } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ICustomerRepository, CustomerFilter } from '../../../domain/interfaces/repositories/customer.repository.interface';
export declare class CustomerRepository implements ICustomerRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<Customer>): Promise<Customer>;
    findById(id: number): Promise<Customer | null>;
    findAll(): Promise<Customer[]>;
    update(id: number, data: Partial<Customer>): Promise<Customer>;
    delete(id: number): Promise<boolean>;
    findByEmail(email: string): Promise<Customer | null>;
    findByPhone(phone: string): Promise<Customer | null>;
    findWithDebts(): Promise<Customer[]>;
    findWithFilters(filter: CustomerFilter): Promise<{
        customers: Customer[];
        total: number;
    }>;
}
