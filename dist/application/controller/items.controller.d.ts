import { CreateItemUseCase } from '../use-cases/item/create-item.use-case';
import { DeleteItemUseCase } from '../use-cases/item/delete-item.use-case';
import { GetItemUseCase } from '../use-cases/item/get-item.use-case';
import { ListItemsUseCase } from '../use-cases/item/list-items.use-case';
import { UpdateItemUseCase } from '../use-cases/item/update-item.use-case';
import { ApiResponseDto } from '../dtos/common/api-response.dto';
import { CreateItemDto } from '../dtos/item/create-item.dto';
import { UpdateItemDto } from '../dtos/item/update-item.dto';
import { ItemResponseDto } from '../dtos/item/item-response.dto';
import { PaginationQueryDto, PaginatedResponseDto } from '../dtos/common/pagination.dto';
export declare class ItemsController {
    private readonly createItemUseCase;
    private readonly deleteItemUseCase;
    private readonly getItemUseCase;
    private readonly listItemsUseCase;
    private readonly updateItemUseCase;
    constructor(createItemUseCase: CreateItemUseCase, deleteItemUseCase: DeleteItemUseCase, getItemUseCase: GetItemUseCase, listItemsUseCase: ListItemsUseCase, updateItemUseCase: UpdateItemUseCase);
    createItem(createItemDto: CreateItemDto): Promise<ApiResponseDto<ItemResponseDto>>;
    getItems(paginationQuery: PaginationQueryDto, name?: string, brand?: string, type?: string, isSellable?: string): Promise<ApiResponseDto<PaginatedResponseDto<ItemResponseDto>>>;
    getAllItems(): Promise<ApiResponseDto<ItemResponseDto[]>>;
    getItemById(id: number): Promise<ApiResponseDto<ItemResponseDto>>;
    getItemByName(name: string): Promise<ApiResponseDto<ItemResponseDto>>;
    getSubItems(parentId: number): Promise<ApiResponseDto<ItemResponseDto[]>>;
    updateItem(id: number, updateItemDto: UpdateItemDto): Promise<ApiResponseDto<ItemResponseDto>>;
    deleteItem(id: number): Promise<ApiResponseDto<boolean>>;
}
