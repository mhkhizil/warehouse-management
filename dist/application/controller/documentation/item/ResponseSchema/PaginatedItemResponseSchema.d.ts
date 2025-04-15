import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { ItemResponseDto } from '../../../../dtos/item/item-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';
declare class PaginatedItemData {
    items: PaginatedResponseDto<ItemResponseDto>;
}
export declare class PaginatedItemResponseSchema extends BaseResponseSchema<PaginatedItemData> {
    data: PaginatedItemData;
    constructor(items: PaginatedResponseDto<ItemResponseDto>);
}
export {};
