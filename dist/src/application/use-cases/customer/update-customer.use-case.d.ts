import { Customer } from '@prisma/client';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { UpdateCustomerDto } from '../../dtos/customer/update-customer.dto';
export declare class UpdateCustomerUseCase {
    private readonly customerRepository;
    private readonly logger;
    constructor(customerRepository: ICustomerRepository);
    execute(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer>;
}
