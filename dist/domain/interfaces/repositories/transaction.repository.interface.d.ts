import { Transaction, TransactionType } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
export type TransactionFilter = {
    type?: TransactionType;
    itemId?: number;
    customerId?: number;
    stockId?: number;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    skip?: number;
    take?: number;
};
export interface ITransactionRepository extends IBaseRepository<Transaction, number> {
    findByCustomerId(customerId: number): Promise<Transaction[]>;
    findByItemId(itemId: number): Promise<Transaction[]>;
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
