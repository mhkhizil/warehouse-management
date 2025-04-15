import { CreateStockDto } from './create-stock.dto';
declare const UpdateStockDto_base: import("@nestjs/common").Type<Partial<Omit<CreateStockDto, "itemId">>>;
export declare class UpdateStockDto extends UpdateStockDto_base {
    quantityChange?: number;
}
export {};
