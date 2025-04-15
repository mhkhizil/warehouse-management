import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Stock } from '@prisma/client';
import { IItemRepository } from '../../../domain/interfaces/repositories/item.repository.interface';
import { IStockRepository } from '../../../domain/interfaces/repositories/stock.repository.interface';
import { CreateStockDto } from '../../dtos/stock/create-stock.dto';

@Injectable()
export class CreateStockUseCase {
  private readonly logger = new Logger(CreateStockUseCase.name);

  constructor(
    private readonly stockRepository: IStockRepository,
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(createStockDto: CreateStockDto): Promise<Stock> {
    this.logger.log(`Creating stock for item ID: ${createStockDto.itemId}`);

    // Check if item exists
    const item = await this.itemRepository.findById(createStockDto.itemId);
    if (!item) {
      this.logger.warn(`Item with ID ${createStockDto.itemId} not found`);
      throw new NotFoundException(
        `Item with ID ${createStockDto.itemId} not found`,
      );
    }

    // Check if stock already exists for this item
    const existingStock = await this.stockRepository.findByItemId(
      createStockDto.itemId,
    );
    if (existingStock) {
      this.logger.warn(
        `Stock already exists for item ID ${createStockDto.itemId}`,
      );
      throw new BadRequestException(
        `Stock already exists for item ID ${createStockDto.itemId}`,
      );
    }

    // Create stock
    const newStock = await this.stockRepository.create({
      ...createStockDto,
      lastRefilled: createStockDto.lastRefilled || new Date(),
    });

    this.logger.log(
      `Stock created with ID: ${newStock.id} for item ID: ${createStockDto.itemId}`,
    );
    return newStock;
  }
}
