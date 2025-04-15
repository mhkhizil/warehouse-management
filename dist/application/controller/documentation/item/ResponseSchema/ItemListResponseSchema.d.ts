import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { ItemResponseDto } from '../../../../dtos/item/item-response.dto';
declare class ItemListData {
    items: ItemResponseDto[];
}
export declare class ItemListResponseSchema extends BaseResponseSchema<ItemListData> {
    data: ItemListData;
    constructor(items: ItemResponseDto[]);
}
export {};
