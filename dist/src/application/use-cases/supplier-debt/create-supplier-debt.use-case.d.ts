import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { CreateSupplierDebtDto } from '../../dtos/supplier-debt/create-supplier-debt.dto';
export declare class CreateSupplierDebtUseCase {
    private supplierDebtRepository;
    private supplierRepository;
    constructor(supplierDebtRepository: ISupplierDebtRepository, supplierRepository: ISupplierRepository);
    execute(data: CreateSupplierDebtDto): Promise<SupplierDebt>;
}
