export declare class CreateItemDto {
    name: string;
    brand?: string;
    type?: string;
    price: number;
    isSellable?: boolean;
    remarks?: string;
    parentItemId?: number;
    initialQuantity?: number;
    refillAlert?: boolean;
}
