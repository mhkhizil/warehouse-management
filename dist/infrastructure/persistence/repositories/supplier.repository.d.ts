import { Supplier } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ISupplierRepository, SupplierFilter } from '../../../domain/interfaces/repositories/supplier.repository.interface';
export declare class SupplierRepository implements ISupplierRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<Supplier>): Promise<Supplier>;
    findById(id: number): Promise<Supplier | null>;
    findAll(): Promise<Supplier[]>;
    update(id: number, data: Partial<Supplier>): Promise<Supplier>;
    delete(id: number): Promise<boolean>;
    findByEmail(email: string): Promise<Supplier | null>;
    findByPhone(phone: string): Promise<Supplier | null>;
    findWithFilters(filter: SupplierFilter): Promise<{
        suppliers: Supplier[];
        total: number;
    }>;
    findWithDebts(): Promise<Supplier[]>;
}
