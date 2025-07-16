import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { StockResponseDto } from '../../../../dtos/stock/stock-response.dto';
declare class StockData {
    stock: StockResponseDto;
}
export declare class StockResponseSchema extends BaseResponseSchema<StockData> {
    data: StockData;
    constructor(stock: StockResponseDto);
}
export {};
