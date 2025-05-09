import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
export declare class FindOverdueSupplierDebtsUseCase {
    private supplierDebtRepository;
    constructor(supplierDebtRepository: ISupplierDebtRepository);
    execute(): Promise<SupplierDebt[]>;
}
