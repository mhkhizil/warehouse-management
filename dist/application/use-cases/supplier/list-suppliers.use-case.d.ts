import { Supplier } from '@prisma/client';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { SupplierFilterDto } from '../../dtos/supplier-filter.dto';
export declare class ListSuppliersUseCase {
    private supplierRepository;
    constructor(supplierRepository: ISupplierRepository);
    execute(filter: SupplierFilterDto): Promise<{
        suppliers: Supplier[];
        total: number;
    }>;
    findAll(): Promise<Supplier[]>;
}
