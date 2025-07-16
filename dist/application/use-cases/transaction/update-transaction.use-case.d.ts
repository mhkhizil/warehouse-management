import { Transaction } from '@prisma/client';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { UpdateTransactionDto } from '../../dtos/transaction/update-transaction.dto';
export declare class UpdateTransactionUseCase {
    private readonly transactionRepository;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository);
    execute(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction>;
}
