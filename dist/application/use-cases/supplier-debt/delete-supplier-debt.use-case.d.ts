import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
export declare class DeleteSupplierDebtUseCase {
    private supplierDebtRepository;
    constructor(supplierDebtRepository: ISupplierDebtRepository);
    execute(id: number): Promise<boolean>;
}
