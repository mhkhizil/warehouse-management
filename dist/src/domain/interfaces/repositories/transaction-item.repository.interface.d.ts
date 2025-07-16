import { TransactionItem } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
export interface ITransactionItemRepository extends IBaseRepository<TransactionItem, number> {
    findByTransactionId(transactionId: number): Promise<TransactionItem[]>;
    findByItemId(itemId: number): Promise<TransactionItem[]>;
    createMany(items: Partial<TransactionItem>[]): Promise<TransactionItem[]>;
    deleteByTransactionId(transactionId: number): Promise<void>;
}
