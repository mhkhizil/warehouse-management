import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { ItemResponseDto } from '../../../../dtos/item/item-response.dto';
declare class ItemData {
    item: ItemResponseDto;
}
export declare class ItemResponseSchema extends BaseResponseSchema<ItemData> {
    data: ItemData;
    constructor(item: ItemResponseDto);
}
export {};
