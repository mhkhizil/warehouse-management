import { TransactionType } from '@prisma/client';
import { CreateDebtDto } from '../debt/create-debt.dto';
import { CreateSupplierDebtDto } from '../supplier-debt/create-supplier-debt.dto';
export declare class CreateTransactionDto {
    type: TransactionType;
    itemId: number;
    stockId?: number;
    customerId?: number;
    supplierId?: number;
    quantity: number;
    unitPrice: number;
    totalAmount?: number;
    date?: Date;
    createDebt?: boolean;
    debt?: CreateDebtDto;
    createSupplierDebt?: boolean;
    supplierDebt?: CreateSupplierDebtDto;
}
