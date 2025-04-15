import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { StockResponseDto } from '../../../../dtos/stock/stock-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';

class PaginatedStockData {
  @ApiProperty({ type: () => PaginatedResponseDto<StockResponseDto> })
  public stocks: PaginatedResponseDto<StockResponseDto>;
}

export class PaginatedStockResponseSchema extends BaseResponseSchema<PaginatedStockData> {
  @ApiProperty({ type: PaginatedStockData })
  public data: PaginatedStockData;

  constructor(stocks: PaginatedResponseDto<StockResponseDto>) {
    super();
    this.message = 'Stocks retrieved successfully';
    this.code = 200;
    this.data = { stocks };
  }
}
