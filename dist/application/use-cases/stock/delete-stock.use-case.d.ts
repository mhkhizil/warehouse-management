import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
export declare class DeleteStockUseCase {
    private readonly stockRepository;
    private readonly logger;
    constructor(stockRepository: IStockRepository);
    execute(id: number): Promise<boolean>;
}
