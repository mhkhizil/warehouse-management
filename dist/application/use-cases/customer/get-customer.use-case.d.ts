import { Customer } from '@prisma/client';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
export declare class GetCustomerUseCase {
    private readonly customerRepository;
    private readonly logger;
    constructor(customerRepository: ICustomerRepository);
    execute(id: number): Promise<Customer>;
    findByEmail(email: string): Promise<Customer>;
    findByPhone(phone: string): Promise<Customer>;
    findWithDebts(): Promise<Customer[]>;
}
