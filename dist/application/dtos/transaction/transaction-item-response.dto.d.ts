import { Item, Stock, TransactionItem } from '@prisma/client';
import { ItemResponseDto } from '../item/item-response.dto';
import { StockResponseDto } from '../stock/stock-response.dto';
interface TransactionItemWithRelations extends TransactionItem {
    item?: Item;
    stock?: Stock;
}
export declare class TransactionItemResponseDto implements Partial<TransactionItem> {
    id: number;
    transactionId: number;
    itemId: number;
    item?: ItemResponseDto;
    stockId: number | null;
    stock?: StockResponseDto;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<TransactionItemWithRelations>);
}
export {};
