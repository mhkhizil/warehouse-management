import { Debt } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
export type DebtFilter = {
    customerId?: number;
    isSettled?: boolean;
    alertSent?: boolean;
    dueBefore?: Date;
    dueAfter?: Date;
    skip?: number;
    take?: number;
};
export interface IDebtRepository extends IBaseRepository<Debt, number> {
    findByCustomerId(customerId: number): Promise<Debt[]>;
    findByTransactionId(transactionId: number): Promise<Debt | null>;
    findWithFilters(filter: DebtFilter): Promise<{
        debts: Debt[];
        total: number;
    }>;
    markAsSettled(id: number): Promise<Debt>;
    markAlertSent(id: number): Promise<Debt>;
    findOverdueDebts(): Promise<Debt[]>;
}
