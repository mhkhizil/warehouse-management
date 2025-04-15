import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';

@Injectable()
export class DeleteStockUseCase {
  private readonly logger = new Logger(DeleteStockUseCase.name);

  constructor(private readonly stockRepository: IStockRepository) {}

  async execute(id: number): Promise<boolean> {
    this.logger.log(`Deleting stock with ID: ${id}`);

    // Check if stock exists
    const stock = await this.stockRepository.findById(id);
    if (!stock) {
      this.logger.warn(`Stock with ID ${id} not found`);
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    // Delete stock
    return await this.stockRepository.delete(id);
  }
}
