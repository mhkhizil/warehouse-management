import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { ItemResponseDto } from '../../../../dtos/item/item-response.dto';

class ItemData {
  @ApiProperty({ type: ItemResponseDto })
  public item: ItemResponseDto;
}

export class ItemResponseSchema extends BaseResponseSchema<ItemData> {
  @ApiProperty({ type: ItemData })
  public data: ItemData;

  constructor(item: ItemResponseDto) {
    super();
    this.message = 'Item retrieved successfully';
    this.code = 200;
    this.data = { item };
  }
}
