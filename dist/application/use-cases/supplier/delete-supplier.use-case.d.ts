import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
export declare class DeleteSupplierUseCase {
    private supplierRepository;
    constructor(supplierRepository: ISupplierRepository);
    execute(id: number): Promise<boolean>;
}
