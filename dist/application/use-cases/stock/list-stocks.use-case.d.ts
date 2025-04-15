import { Stock } from '@prisma/client';
import { IStockRepository, StockFilter } from '../../../domain/interfaces/repositories/stock.repository.interface';
export declare class ListStocksUseCase {
    private readonly stockRepository;
    private readonly logger;
    constructor(stockRepository: IStockRepository);
    execute(filter: StockFilter): Promise<{
        stocks: Stock[];
        total: number;
    }>;
    findAll(): Promise<Stock[]>;
}
