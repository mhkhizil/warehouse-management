import { Item } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
export declare class GetItemUseCase {
    private readonly itemRepository;
    private readonly logger;
    constructor(itemRepository: IItemRepository);
    execute(id: number): Promise<Item>;
    findByName(name: string): Promise<Item>;
    getSubItems(parentItemId: number): Promise<Item[]>;
}
