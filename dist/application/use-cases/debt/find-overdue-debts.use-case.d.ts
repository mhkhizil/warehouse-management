import { Debt } from '@prisma/client';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
export declare class FindOverdueDebtsUseCase {
    private readonly debtRepository;
    private readonly logger;
    constructor(debtRepository: IDebtRepository);
    execute(): Promise<Debt[]>;
}
