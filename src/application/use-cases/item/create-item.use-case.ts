import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Item } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { CreateItemDto } from '../../dtos/item/create-item.dto';

@Injectable()
export class CreateItemUseCase {
  private readonly logger = new Logger(CreateItemUseCase.name);

  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(createItemDto: CreateItemDto): Promise<Item> {
    this.logger.log(`Creating item with name: ${createItemDto.name}`);

    // Check for duplicate item name
    const existingItem = await this.itemRepository.findByName(
      createItemDto.name,
    );
    if (existingItem) {
      this.logger.warn(`Item with name ${createItemDto.name} already exists`);
      throw new BadRequestException(
        `Item with name ${createItemDto.name} already exists`,
      );
    }

    // Check if parent item exists if provided
    if (createItemDto.parentItemId) {
      const parentItem = await this.itemRepository.findById(
        createItemDto.parentItemId,
      );
      if (!parentItem) {
        this.logger.warn(
          `Parent item with ID ${createItemDto.parentItemId} not found`,
        );
        throw new BadRequestException(
          `Parent item with ID ${createItemDto.parentItemId} not found`,
        );
      }
    }

    // Extract stock-related data
    const { initialQuantity, refillAlert, ...itemData } = createItemDto;

    // Create the item
    const newItem = await this.itemRepository.create(itemData);

    // Create stock entry if initial quantity is provided
    if (initialQuantity !== undefined) {
      await this.stockRepository.create({
        itemId: newItem.id,
        quantity: initialQuantity,
        refillAlert: refillAlert || false,
        lastRefilled: new Date(),
      });
    }

    this.logger.log(`Item created with ID: ${newItem.id}`);
    return newItem;
  }
}
