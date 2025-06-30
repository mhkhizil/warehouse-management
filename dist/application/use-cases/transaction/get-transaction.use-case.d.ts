import { Transaction } from '@prisma/client';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
export declare class GetTransactionUseCase {
    private readonly transactionRepository;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository);
    execute(id: number): Promise<Transaction>;
    findByCustomerId(customerId: number): Promise<Transaction[]>;
    findBySupplierId(supplierId: number): Promise<Transaction[]>;
}
