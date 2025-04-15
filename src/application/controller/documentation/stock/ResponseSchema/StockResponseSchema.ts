import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { StockResponseDto } from '../../../../dtos/stock/stock-response.dto';

class StockData {
  @ApiProperty({ type: StockResponseDto })
  public stock: StockResponseDto;
}

export class StockResponseSchema extends BaseResponseSchema<StockData> {
  @ApiProperty({ type: StockData })
  public data: StockData;

  constructor(stock: StockResponseDto) {
    super();
    this.message = 'Stock retrieved successfully';
    this.code = 200;
    this.data = { stock };
  }
}
