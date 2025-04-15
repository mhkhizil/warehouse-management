import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Item } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';

@Injectable()
export class GetItemUseCase {
  private readonly logger = new Logger(GetItemUseCase.name);

  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: number): Promise<Item> {
    this.logger.log(`Fetching item with ID: ${id}`);

    const item = await this.itemRepository.findById(id);
    if (!item) {
      this.logger.warn(`Item with ID ${id} not found`);
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async findByName(name: string): Promise<Item> {
    this.logger.log(`Fetching item with name: ${name}`);

    const item = await this.itemRepository.findByName(name);
    if (!item) {
      this.logger.warn(`Item with name ${name} not found`);
      throw new NotFoundException(`Item with name ${name} not found`);
    }

    return item;
  }

  async getSubItems(parentItemId: number): Promise<Item[]> {
    this.logger.log(`Fetching sub-items for parent item ID: ${parentItemId}`);

    // Verify parent item exists
    const parentItem = await this.itemRepository.findById(parentItemId);
    if (!parentItem) {
      this.logger.warn(`Parent item with ID ${parentItemId} not found`);
      throw new NotFoundException(
        `Parent item with ID ${parentItemId} not found`,
      );
    }

    return this.itemRepository.findSubItems(parentItemId);
  }
}
