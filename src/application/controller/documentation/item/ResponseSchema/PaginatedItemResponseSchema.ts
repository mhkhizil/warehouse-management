import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { ItemResponseDto } from '../../../../dtos/item/item-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';

class PaginatedItemData {
  @ApiProperty({ type: () => PaginatedResponseDto<ItemResponseDto> })
  public items: PaginatedResponseDto<ItemResponseDto>;
}

export class PaginatedItemResponseSchema extends BaseResponseSchema<PaginatedItemData> {
  @ApiProperty({ type: PaginatedItemData })
  public data: PaginatedItemData;

  constructor(items: PaginatedResponseDto<ItemResponseDto>) {
    super();
    this.message = 'Items retrieved successfully';
    this.code = 200;
    this.data = { items };
  }
}
