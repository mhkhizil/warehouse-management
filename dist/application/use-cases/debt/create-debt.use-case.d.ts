import { Debt } from '@prisma/client';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
import { ICustomerRepository } from '../../../domain/interfaces/repositories/customer.repository.interface';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { CreateDebtDto } from '../../dtos/debt/create-debt.dto';
export declare class CreateDebtUseCase {
    private readonly debtRepository;
    private readonly customerRepository;
    private readonly transactionRepository;
    private readonly logger;
    constructor(debtRepository: IDebtRepository, customerRepository: ICustomerRepository, transactionRepository: ITransactionRepository);
    execute(createDebtDto: CreateDebtDto): Promise<Debt>;
}
