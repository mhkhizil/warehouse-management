import { Item } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { CreateItemDto } from '../../dtos/item/create-item.dto';
export declare class CreateItemUseCase {
    private readonly itemRepository;
    private readonly stockRepository;
    private readonly logger;
    constructor(itemRepository: IItemRepository, stockRepository: IStockRepository);
    execute(createItemDto: CreateItemDto): Promise<Item>;
}
