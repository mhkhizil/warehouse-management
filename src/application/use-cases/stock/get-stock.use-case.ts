import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';

@Injectable()
export class GetStockUseCase {
  private readonly logger = new Logger(GetStockUseCase.name);

  constructor(
    private readonly stockRepository: IStockRepository,
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(id: number): Promise<Stock> {
    this.logger.log(`Fetching stock with ID: ${id}`);

    const stock = await this.stockRepository.findById(id);
    if (!stock) {
      this.logger.warn(`Stock with ID ${id} not found`);
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    return stock;
  }

  async getByItemId(itemId: number): Promise<Stock> {
    this.logger.log(`Fetching stock for item ID: ${itemId}`);

    // Verify item exists
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      this.logger.warn(`Item with ID ${itemId} not found`);
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const stock = await this.stockRepository.findByItemId(itemId);
    if (!stock) {
      this.logger.warn(`Stock for item ID ${itemId} not found`);
      throw new NotFoundException(`Stock for item ID ${itemId} not found`);
    }

    return stock;
  }

  async getLowStock(threshold?: number): Promise<Stock[]> {
    this.logger.log(
      `Fetching low stock items${threshold ? ` with threshold: ${threshold}` : ''}`,
    );
    return this.stockRepository.findLowStock(threshold);
  }
}
