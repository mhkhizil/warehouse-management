import { Customer } from '@prisma/client';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { CreateCustomerDto } from '../../dtos/customer/create-customer.dto';
export declare class CreateCustomerUseCase {
    private readonly customerRepository;
    private readonly logger;
    constructor(customerRepository: ICustomerRepository);
    execute(createCustomerDto: CreateCustomerDto): Promise<Customer>;
}
