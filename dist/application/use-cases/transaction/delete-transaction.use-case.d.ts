import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
export declare class DeleteTransactionUseCase {
    private readonly transactionRepository;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository);
    execute(id: number): Promise<boolean>;
}
