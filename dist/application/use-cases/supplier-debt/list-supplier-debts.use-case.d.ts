import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { SupplierDebtFilterDto } from '../../dtos/supplier-debt-filter.dto';
export declare class ListSupplierDebtsUseCase {
    private supplierDebtRepository;
    constructor(supplierDebtRepository: ISupplierDebtRepository);
    execute(filter: SupplierDebtFilterDto): Promise<{
        debts: SupplierDebt[];
        total: number;
    }>;
    findAll(): Promise<SupplierDebt[]>;
}
