import { SupplierDebt } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ISupplierDebtRepository, SupplierDebtFilter } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
export declare class SupplierDebtRepository implements ISupplierDebtRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<SupplierDebt>): Promise<SupplierDebt>;
    findById(id: number): Promise<SupplierDebt | null>;
    findAll(): Promise<SupplierDebt[]>;
    update(id: number, data: Partial<SupplierDebt>): Promise<SupplierDebt>;
    delete(id: number): Promise<boolean>;
    findBySupplierId(supplierId: number): Promise<SupplierDebt[]>;
    findByTransactionId(transactionId: number): Promise<SupplierDebt | null>;
    findUnsettled(): Promise<SupplierDebt[]>;
    findUnsettledBySupplierId(supplierId: number): Promise<SupplierDebt[]>;
    findWithFilters(filter: SupplierDebtFilter): Promise<{
        debts: SupplierDebt[];
        total: number;
    }>;
    updateSettlementStatus(id: number, isSettled: boolean): Promise<SupplierDebt>;
}
