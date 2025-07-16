import { Debt } from '@prisma/client';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
export declare class MarkDebtSettledUseCase {
    private readonly debtRepository;
    private readonly logger;
    constructor(debtRepository: IDebtRepository);
    execute(id: number): Promise<Debt>;
}
