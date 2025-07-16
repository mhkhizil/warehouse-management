import { Customer } from '@prisma/client';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { CustomerFilter } from '../../../domain/filters/customer.filter';
export declare class ListCustomersUseCase {
    private readonly customerRepository;
    private readonly logger;
    constructor(customerRepository: ICustomerRepository);
    execute(filter: CustomerFilter): Promise<{
        customers: Customer[];
        total: number;
    }>;
    findAll(): Promise<Customer[]>;
}
