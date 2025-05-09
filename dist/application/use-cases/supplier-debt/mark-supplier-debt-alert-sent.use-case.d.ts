import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
export declare class MarkSupplierDebtAlertSentUseCase {
    private supplierDebtRepository;
    constructor(supplierDebtRepository: ISupplierDebtRepository);
    execute(id: number): Promise<SupplierDebt>;
}
