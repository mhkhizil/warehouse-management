import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { UpdateSupplierDebtDto } from '../../dtos/supplier-debt/update-supplier-debt.dto';
export declare class UpdateSupplierDebtUseCase {
    private supplierDebtRepository;
    constructor(supplierDebtRepository: ISupplierDebtRepository);
    execute(id: number, data: UpdateSupplierDebtDto): Promise<SupplierDebt>;
}
