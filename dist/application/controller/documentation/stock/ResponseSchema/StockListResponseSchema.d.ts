import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { StockResponseDto } from '../../../../dtos/stock/stock-response.dto';
declare class StockListData {
    stocks: StockResponseDto[];
}
export declare class StockListResponseSchema extends BaseResponseSchema<StockListData> {
    data: StockListData;
    constructor(stocks: StockResponseDto[]);
}
export {};
