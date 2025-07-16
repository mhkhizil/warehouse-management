import { Debt } from '@prisma/client';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
import { UpdateDebtDto } from '../../dtos/debt/update-debt.dto';
export declare class UpdateDebtUseCase {
    private readonly debtRepository;
    private readonly logger;
    constructor(debtRepository: IDebtRepository);
    execute(id: number, updateDebtDto: UpdateDebtDto): Promise<Debt>;
}
