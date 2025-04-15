import { ApiProperty } from '@nestjs/swagger';
import { Item, Stock } from '@prisma/client';
import { Type } from 'class-transformer';
import { ItemResponseDto } from '../item/item-response.dto';

// Define interface with relations
interface StockWithRelations extends Stock {
  item?: Item;
}

export class StockResponseDto implements Partial<Stock> {
  @ApiProperty({ description: 'Stock ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Associated item ID', example: 1 })
  itemId: number;

  @ApiProperty({
    description: 'Item information',
    type: ItemResponseDto,
  })
  @Type(() => ItemResponseDto)
  item?: ItemResponseDto;

  @ApiProperty({ description: 'Current quantity', example: 42 })
  quantity: number;

  @ApiProperty({
    description: 'Last refill date',
    example: '2023-01-01T00:00:00Z',
  })
  lastRefilled: Date | null;

  @ApiProperty({ description: 'Refill alert status', example: true })
  refillAlert: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-02T00:00:00Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<Stock> & { item?: Partial<Item> }) {
    Object.assign(this, partial);

    if (partial.item) {
      this.item = new ItemResponseDto(partial.item);
    }
  }
}
