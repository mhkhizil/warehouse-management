import { Supplier } from '@prisma/client';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { UpdateSupplierDto } from '../../dtos/supplier/update-supplier.dto';
export declare class UpdateSupplierUseCase {
    private supplierRepository;
    constructor(supplierRepository: ISupplierRepository);
    execute(id: number, data: UpdateSupplierDto): Promise<Supplier>;
}
