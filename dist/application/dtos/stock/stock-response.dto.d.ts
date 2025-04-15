import { Item, Stock } from '@prisma/client';
import { ItemResponseDto } from '../item/item-response.dto';
export declare class StockResponseDto implements Partial<Stock> {
    id: number;
    itemId: number;
    item?: ItemResponseDto;
    quantity: number;
    lastRefilled: Date | null;
    refillAlert: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Stock> & {
        item?: Partial<Item>;
    });
}
