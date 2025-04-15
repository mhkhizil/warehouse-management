import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
export declare class DeleteDebtUseCase {
    private readonly debtRepository;
    private readonly logger;
    constructor(debtRepository: IDebtRepository);
    execute(id: number): Promise<boolean>;
}
