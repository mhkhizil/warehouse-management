import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
export declare class GetSupplierDebtUseCase {
    private supplierDebtRepository;
    constructor(supplierDebtRepository: ISupplierDebtRepository);
    execute(id: number): Promise<SupplierDebt>;
    findByTransactionId(transactionId: number): Promise<SupplierDebt>;
    findBySupplierId(supplierId: number): Promise<SupplierDebt[]>;
}
