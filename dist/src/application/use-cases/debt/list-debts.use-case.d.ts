import { Debt } from '@prisma/client';
import { DebtFilter } from '../../../domain/filters/debt.filter';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
export declare class ListDebtsUseCase {
    private readonly debtRepository;
    private readonly logger;
    constructor(debtRepository: IDebtRepository);
    execute(filter: DebtFilter): Promise<{
        debts: Debt[];
        total: number;
    }>;
    findAll(): Promise<Debt[]>;
    findOverdueDebts(): Promise<Debt[]>;
}
