import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Item } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { UpdateItemDto } from '../../dtos/item/update-item.dto';

@Injectable()
export class UpdateItemUseCase {
  private readonly logger = new Logger(UpdateItemUseCase.name);

  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    this.logger.log(`Updating item with ID: ${id}`);

    // Check if item exists
    const item = await this.itemRepository.findById(id);
    if (!item) {
      this.logger.warn(`Item with ID ${id} not found`);
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // Check if updating name and it's already in use
    if (updateItemDto.name && updateItemDto.name !== item.name) {
      const existingItemWithName = await this.itemRepository.findByName(
        updateItemDto.name,
      );
      if (existingItemWithName && existingItemWithName.id !== id) {
        this.logger.warn(`Item with name ${updateItemDto.name} already exists`);
        throw new BadRequestException(
          `Item with name ${updateItemDto.name} already exists`,
        );
      }
    }

    // Check if updating parent item ID and it exists
    if (
      updateItemDto.parentItemId &&
      updateItemDto.parentItemId !== item.parentItemId
    ) {
      // Prevent circular references (item can't be its own parent)
      if (updateItemDto.parentItemId === id) {
        this.logger.warn('Item cannot be its own parent');
        throw new BadRequestException('Item cannot be its own parent');
      }

      const parentItem = await this.itemRepository.findById(
        updateItemDto.parentItemId,
      );
      if (!parentItem) {
        this.logger.warn(
          `Parent item with ID ${updateItemDto.parentItemId} not found`,
        );
        throw new BadRequestException(
          `Parent item with ID ${updateItemDto.parentItemId} not found`,
        );
      }
    }

    // Extract stock quantity change if provided
    const { stockQuantity, ...itemUpdateData } = updateItemDto;

    // Update item data
    const updatedItem = await this.itemRepository.update(id, itemUpdateData);

    // Update stock quantity if provided
    if (stockQuantity !== undefined) {
      // Use type assertion to inform TypeScript that item has a 'stock' property
      const itemWithStock = item as Item & {
        stock?: { id: number; quantity: number }[];
      };
      const stock = itemWithStock.stock?.[0];
      if (stock) {
        await this.stockRepository.update(stock.id, {
          quantity: stockQuantity,
          lastRefilled: new Date(),
        });
      } else {
        // Create new stock entry if one doesn't exist
        await this.stockRepository.create({
          itemId: id,
          quantity: stockQuantity,
          lastRefilled: new Date(),
        });
      }
    }

    this.logger.log(`Item with ID ${id} updated successfully`);
    return updatedItem;
  }
}
