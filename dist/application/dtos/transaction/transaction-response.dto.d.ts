import { Customer, Debt, Item, Stock, Transaction, TransactionType } from '@prisma/client';
import { CustomerResponseDto } from '../customer/customer-response.dto';
import { DebtResponseDto } from '../debt/debt-response.dto';
import { ItemResponseDto } from '../item/item-response.dto';
import { StockResponseDto } from '../stock/stock-response.dto';
export declare class TransactionResponseDto implements Partial<Transaction> {
    id: number;
    type: TransactionType;
    itemId: number;
    item?: ItemResponseDto;
    stockId: number | null;
    stock?: StockResponseDto;
    customerId: number | null;
    customer?: CustomerResponseDto;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    date: Date;
    debt?: DebtResponseDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Transaction> & {
        item?: Partial<Item>;
        stock?: Partial<Stock>;
        customer?: Partial<Customer>;
        debt?: Partial<Debt>[];
    });
}
