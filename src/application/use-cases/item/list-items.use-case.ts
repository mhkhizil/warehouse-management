import { Injectable, Logger } from '@nestjs/common';
import { Item } from '@prisma/client';
import {
  IItemRepository,
  ItemFilter,
} from '../../../domain/interfaces/repositories/item.repository.interface';

@Injectable()
export class ListItemsUseCase {
  private readonly logger = new Logger(ListItemsUseCase.name);

  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(filter: ItemFilter): Promise<{ items: Item[]; total: number }> {
    this.logger.log('Fetching items with filters');
    return await this.itemRepository.findWithFilters(filter);
  }

  async findAll(): Promise<Item[]> {
    this.logger.log('Fetching all items');
    return await this.itemRepository.findAll();
  }
}
