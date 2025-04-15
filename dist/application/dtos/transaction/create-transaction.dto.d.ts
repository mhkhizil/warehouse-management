import { TransactionType } from '@prisma/client';
import { CreateDebtDto } from '../debt/create-debt.dto';
export declare class CreateTransactionDto {
    type: TransactionType;
    itemId: number;
    stockId?: number;
    customerId?: number;
    quantity: number;
    unitPrice: number;
    totalAmount?: number;
    date?: Date;
    createDebt?: boolean;
    debt?: CreateDebtDto;
}
