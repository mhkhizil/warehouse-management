import { Stock } from '@prisma/client';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { UpdateStockDto } from '../../dtos/stock/update-stock.dto';
export declare class UpdateStockUseCase {
    private readonly stockRepository;
    private readonly logger;
    constructor(stockRepository: IStockRepository);
    execute(id: number, updateStockDto: UpdateStockDto): Promise<Stock>;
}
