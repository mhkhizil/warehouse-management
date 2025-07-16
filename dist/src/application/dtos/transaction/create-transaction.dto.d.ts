import { TransactionType } from '@prisma/client';
import { CreateDebtDto } from '../debt/create-debt.dto';
import { CreateSupplierDebtDto } from '../supplier-debt/create-supplier-debt.dto';
import { CreateTransactionItemDto } from './create-transaction-item.dto';
export declare class CreateTransactionDto {
    type: TransactionType;
    customerId?: number;
    supplierId?: number;
    items: CreateTransactionItemDto[];
    totalAmount?: number;
    date?: Date;
    createDebt?: boolean;
    debt?: CreateDebtDto;
    createSupplierDebt?: boolean;
    supplierDebt?: CreateSupplierDebtDto;
}
