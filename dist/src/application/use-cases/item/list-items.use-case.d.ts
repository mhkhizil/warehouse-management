import { Item } from '@prisma/client';
import { IItemRepository, ItemFilter } from '../../../domain/interfaces/repositories/item.repository.interface';
export declare class ListItemsUseCase {
    private readonly itemRepository;
    private readonly logger;
    constructor(itemRepository: IItemRepository);
    execute(filter: ItemFilter): Promise<{
        items: Item[];
        total: number;
    }>;
    findAll(): Promise<Item[]>;
}
