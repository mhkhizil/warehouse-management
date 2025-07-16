import { TransactionItem } from '@prisma/client';
import { ITransactionItemRepository } from '../../../domain/interfaces/repositories/transaction-item.repository.interface';
import { PrismaService } from '../prisma/prisma.service';
export declare class TransactionItemRepository implements ITransactionItemRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<TransactionItem>): Promise<TransactionItem>;
    findById(id: number): Promise<TransactionItem | null>;
    findAll(): Promise<TransactionItem[]>;
    update(id: number, data: Partial<TransactionItem>): Promise<TransactionItem>;
    delete(id: number): Promise<boolean>;
    findByTransactionId(transactionId: number): Promise<TransactionItem[]>;
    findByItemId(itemId: number): Promise<TransactionItem[]>;
    createMany(items: Partial<TransactionItem>[]): Promise<TransactionItem[]>;
    deleteByTransactionId(transactionId: number): Promise<void>;
}
