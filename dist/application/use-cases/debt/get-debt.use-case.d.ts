import { Debt } from '@prisma/client';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
export declare class GetDebtUseCase {
    private readonly debtRepository;
    private readonly logger;
    constructor(debtRepository: IDebtRepository);
    execute(id: number): Promise<Debt>;
    findByCustomerId(customerId: number): Promise<Debt[]>;
    findByTransactionId(transactionId: number): Promise<Debt>;
}
