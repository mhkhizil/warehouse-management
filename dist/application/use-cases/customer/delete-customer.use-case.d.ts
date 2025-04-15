import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
export declare class DeleteCustomerUseCase {
    private readonly customerRepository;
    private readonly logger;
    constructor(customerRepository: ICustomerRepository);
    execute(id: number): Promise<boolean>;
}
