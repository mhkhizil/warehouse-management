import { Supplier } from '@prisma/client';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
export declare class GetSupplierUseCase {
    private supplierRepository;
    constructor(supplierRepository: ISupplierRepository);
    execute(id: number): Promise<Supplier>;
    findByEmail(email: string): Promise<Supplier>;
    findByPhone(phone: string): Promise<Supplier>;
    findWithDebts(): Promise<Supplier[]>;
}
