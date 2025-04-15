import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { StockResponseDto } from '../../../../dtos/stock/stock-response.dto';

class StockListData {
  @ApiProperty({ type: [StockResponseDto] })
  public stocks: StockResponseDto[];
}

export class StockListResponseSchema extends BaseResponseSchema<StockListData> {
  @ApiProperty({ type: StockListData })
  public data: StockListData;

  constructor(stocks: StockResponseDto[]) {
    super();
    this.message = 'Stocks retrieved successfully';
    this.code = 200;
    this.data = { stocks };
  }
}
