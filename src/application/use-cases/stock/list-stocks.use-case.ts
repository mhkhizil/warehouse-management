import { Injectable, Logger } from '@nestjs/common';
import { Stock } from '@prisma/client';
import {
  IStockRepository,
  StockFilter,
} from '../../../domain/interfaces/repositories/stock.repository.interface';

@Injectable()
export class ListStocksUseCase {
  private readonly logger = new Logger(ListStocksUseCase.name);

  constructor(private readonly stockRepository: IStockRepository) {}

  async execute(
    filter: StockFilter,
  ): Promise<{ stocks: Stock[]; total: number }> {
    this.logger.log('Fetching stocks with filters');
    return await this.stockRepository.findWithFilters(filter);
  }

  async findAll(): Promise<Stock[]> {
    this.logger.log('Fetching all stocks');
    return await this.stockRepository.findAll();
  }
}
