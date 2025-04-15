import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';

@Injectable()
export class DeleteItemUseCase {
  private readonly logger = new Logger(DeleteItemUseCase.name);

  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(id: number): Promise<boolean> {
    this.logger.log(`Deleting item with ID: ${id}`);

    // Check if item exists
    const item = await this.itemRepository.findById(id);
    if (!item) {
      this.logger.warn(`Item with ID ${id} not found`);
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // Check if the item has sub-items
    const subItems = await this.itemRepository.findSubItems(id);
    if (subItems.length > 0) {
      this.logger.warn(
        `Item with ID ${id} has ${subItems.length} sub-items and cannot be deleted`,
      );
      throw new BadRequestException(
        `This item has ${subItems.length} sub-items and cannot be deleted. Please delete or reassign the sub-items first.`,
      );
    }

    // Delete item
    return await this.itemRepository.delete(id);
  }
}
