import { Item, Stock } from '@prisma/client';
export declare class StockInfoDto implements Partial<Stock> {
    id: number;
    itemId: number;
    quantity: number;
    lastRefilled: Date | null;
    refillAlert: boolean;
    constructor(partial: Partial<Stock>);
}
export declare class ItemResponseDto implements Partial<Item> {
    id: number;
    name: string;
    brand: string | null;
    type: string | null;
    price: number;
    isSellable: boolean;
    remarks: string | null;
    parentItemId: number | null;
    createdAt: Date;
    updatedAt: Date;
    stock?: StockInfoDto[];
    subItems?: ItemResponseDto[];
    constructor(partial: Partial<Item> & {
        stock?: Partial<Stock>[];
        subItems?: Partial<Item>[];
    });
}
