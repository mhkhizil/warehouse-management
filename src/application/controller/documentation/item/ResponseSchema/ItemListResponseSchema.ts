import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { ItemResponseDto } from '../../../../dtos/item/item-response.dto';

class ItemListData {
  @ApiProperty({ type: [ItemResponseDto] })
  public items: ItemResponseDto[];
}

export class ItemListResponseSchema extends BaseResponseSchema<ItemListData> {
  @ApiProperty({ type: ItemListData })
  public data: ItemListData;

  constructor(items: ItemResponseDto[]) {
    super();
    this.message = 'Items retrieved successfully';
    this.code = 200;
    this.data = { items };
  }
}
