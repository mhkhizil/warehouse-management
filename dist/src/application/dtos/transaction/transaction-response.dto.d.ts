import { Customer, Debt, Supplier, SupplierDebt, Transaction, TransactionType, TransactionItem } from '@prisma/client';
import { CustomerResponseDto } from '../customer/customer-response.dto';
import { DebtResponseDto } from '../debt/debt-response.dto';
import { SupplierResponseDto } from '../supplier/supplier-response.dto';
import { SupplierDebtResponseDto } from '../supplier-debt/supplier-debt-response.dto';
import { TransactionItemResponseDto } from './transaction-item-response.dto';
interface TransactionWithRelations extends Transaction {
    customer?: Customer;
    supplier?: Supplier;
    debt?: Debt[];
    supplierDebt?: SupplierDebt[];
    transactionItems?: TransactionItem[];
}
export declare class TransactionResponseDto implements Partial<Transaction> {
    id: number;
    type: TransactionType;
    customerId: number | null;
    customer?: CustomerResponseDto;
    supplierId: number | null;
    supplier?: SupplierResponseDto;
    transactionItems?: TransactionItemResponseDto[];
    totalAmount: number;
    date: Date;
    debt?: DebtResponseDto[];
    supplierDebt?: SupplierDebtResponseDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<TransactionWithRelations>);
}
export {};
