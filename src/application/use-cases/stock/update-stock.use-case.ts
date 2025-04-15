import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { UpdateStockDto } from '../../dtos/stock/update-stock.dto';

@Injectable()
export class UpdateStockUseCase {
  private readonly logger = new Logger(UpdateStockUseCase.name);

  constructor(private readonly stockRepository: IStockRepository) {}

  async execute(id: number, updateStockDto: UpdateStockDto): Promise<Stock> {
    this.logger.log(`Updating stock with ID: ${id}`);

    // Check if stock exists
    const stock = await this.stockRepository.findById(id);
    if (!stock) {
      this.logger.warn(`Stock with ID ${id} not found`);
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    // If quantityChange is provided, calculate new quantity
    if (updateStockDto.quantityChange !== undefined) {
      const newQuantity = stock.quantity + updateStockDto.quantityChange;

      // Prevent negative stock
      if (newQuantity < 0) {
        this.logger.warn(
          `Cannot reduce stock quantity below zero. Current: ${stock.quantity}, Requested change: ${updateStockDto.quantityChange}`,
        );
        throw new Error(
          `Cannot reduce stock quantity below zero. Current: ${stock.quantity}, Requested change: ${updateStockDto.quantityChange}`,
        );
      }

      // Update stock using updateQuantity method
      return this.stockRepository.updateQuantity(id, newQuantity);
    }

    // If quantity is provided directly, update it
    if (updateStockDto.quantity !== undefined) {
      // Prevent negative stock
      if (updateStockDto.quantity < 0) {
        this.logger.warn(
          `Cannot set stock quantity below zero. Requested: ${updateStockDto.quantity}`,
        );
        throw new Error(
          `Cannot set stock quantity below zero. Requested: ${updateStockDto.quantity}`,
        );
      }
    }

    // Apply other updates (and also quantity if directly specified)
    const updatedStock = await this.stockRepository.update(id, {
      ...updateStockDto,
      lastRefilled:
        updateStockDto.quantity !== undefined ? new Date() : stock.lastRefilled,
    });

    this.logger.log(`Stock with ID ${id} updated successfully`);
    return updatedStock;
  }
}
