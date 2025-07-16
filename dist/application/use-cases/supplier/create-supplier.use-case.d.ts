import { Supplier } from '@prisma/client';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { CreateSupplierDto } from '../../dtos/supplier/create-supplier.dto';
export declare class CreateSupplierUseCase {
    private supplierRepository;
    constructor(supplierRepository: ISupplierRepository);
    execute(data: CreateSupplierDto): Promise<Supplier>;
}
