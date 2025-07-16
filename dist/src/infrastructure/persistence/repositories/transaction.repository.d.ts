import { Transaction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ITransactionRepository, TransactionFilter } from '../../../domain/interfaces/repositories/transaction.repository.interface';
export declare class TransactionRepository implements ITransactionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<Transaction>): Promise<Transaction>;
    findById(id: number): Promise<Transaction | null>;
    findAll(): Promise<Transaction[]>;
    update(id: number, data: Partial<Transaction>): Promise<Transaction>;
    delete(id: number): Promise<boolean>;
    findByCustomerId(customerId: number): Promise<Transaction[]>;
    findBySupplierId(supplierId: number): Promise<Transaction[]>;
    findWithFilters(filter: TransactionFilter): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
    getSalesReport(startDate: Date, endDate: Date): Promise<{
        totalSales: number;
        transactions: Transaction[];
    }>;
    getPurchaseReport(startDate: Date, endDate: Date): Promise<{
        totalPurchases: number;
        transactions: Transaction[];
    }>;
}
