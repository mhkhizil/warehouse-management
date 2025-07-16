import { Stock } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { CreateStockDto } from '../../dtos/stock/create-stock.dto';
export declare class CreateStockUseCase {
    private readonly stockRepository;
    private readonly itemRepository;
    private readonly logger;
    constructor(stockRepository: IStockRepository, itemRepository: IItemRepository);
    execute(createStockDto: CreateStockDto): Promise<Stock>;
}
