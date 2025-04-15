import { Stock } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
export declare class GetStockUseCase {
    private readonly stockRepository;
    private readonly itemRepository;
    private readonly logger;
    constructor(stockRepository: IStockRepository, itemRepository: IItemRepository);
    execute(id: number): Promise<Stock>;
    getByItemId(itemId: number): Promise<Stock>;
    getLowStock(threshold?: number): Promise<Stock[]>;
}
