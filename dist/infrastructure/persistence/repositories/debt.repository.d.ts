import { Debt } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DebtFilter, IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
export declare class DebtRepository implements IDebtRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<Debt>): Promise<Debt>;
    findById(id: number): Promise<Debt | null>;
    findAll(): Promise<Debt[]>;
    update(id: number, data: Partial<Debt>): Promise<Debt>;
    delete(id: number): Promise<boolean>;
    findByCustomerId(customerId: number): Promise<Debt[]>;
    findByTransactionId(transactionId: number): Promise<Debt | null>;
    markAsSettled(id: number): Promise<Debt>;
    markAlertSent(id: number): Promise<Debt>;
    findOverdueDebts(): Promise<Debt[]>;
    findWithFilters(filter: DebtFilter): Promise<{
        debts: Debt[];
        total: number;
    }>;
}
