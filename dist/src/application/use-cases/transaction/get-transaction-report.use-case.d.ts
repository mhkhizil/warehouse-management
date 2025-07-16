import { Transaction } from '@prisma/client';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
export declare class GetTransactionReportUseCase {
    private readonly transactionRepository;
    private readonly logger;
    constructor(transactionRepository: ITransactionRepository);
    getSalesReport(startDate: Date, endDate: Date): Promise<{
        totalSales: number;
        transactions: Transaction[];
    }>;
    getPurchaseReport(startDate: Date, endDate: Date): Promise<{
        totalPurchases: number;
        transactions: Transaction[];
    }>;
}
