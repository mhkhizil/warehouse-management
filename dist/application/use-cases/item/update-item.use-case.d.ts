import { Item } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { UpdateItemDto } from '../../dtos/item/update-item.dto';
export declare class UpdateItemUseCase {
    private readonly itemRepository;
    private readonly stockRepository;
    private readonly logger;
    constructor(itemRepository: IItemRepository, stockRepository: IStockRepository);
    execute(id: number, updateItemDto: UpdateItemDto): Promise<Item>;
}
