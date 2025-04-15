import { Transaction } from '@prisma/client';
import { TransactionFilter } from '../../../domain/filters/transaction.filter';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
export declare class ListTransactionsUseCase {
    private readonly transactionRepository;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository);
    execute(filter: TransactionFilter): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
    findAll(): Promise<Transaction[]>;
}
