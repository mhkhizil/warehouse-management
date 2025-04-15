import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { StockResponseDto } from '../../../../dtos/stock/stock-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';
declare class PaginatedStockData {
    stocks: PaginatedResponseDto<StockResponseDto>;
}
export declare class PaginatedStockResponseSchema extends BaseResponseSchema<PaginatedStockData> {
    data: PaginatedStockData;
    constructor(stocks: PaginatedResponseDto<StockResponseDto>);
}
export {};
