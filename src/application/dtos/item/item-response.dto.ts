import { ApiProperty } from '@nestjs/swagger';
import { Item, Stock } from '@prisma/client';
import { Type } from 'class-transformer';

// Define interface with relations
interface ItemWithRelations extends Item {
  stock?: Stock[];
  subItems?: ItemWithRelations[];
}

export class StockInfoDto implements Partial<Stock> {
  @ApiProperty({ description: 'Stock ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Item ID', example: 1 })
  itemId: number;

  @ApiProperty({ description: 'Current quantity', example: 25 })
  quantity: number;

  @ApiProperty({
    description: 'Last refill date',
    example: '2023-01-01T00:00:00Z',
  })
  lastRefilled: Date | null;

  @ApiProperty({ description: 'Refill alert status', example: true })
  refillAlert: boolean;

  constructor(partial: Partial<Stock>) {
    Object.assign(this, partial);
  }
}

export class ItemResponseDto implements Partial<Item> {
  @ApiProperty({ description: 'Item ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Item name', example: 'Car Bumper Model X123' })
  name: string;

  @ApiProperty({ description: 'Item brand', example: 'Toyota' })
  brand: string | null;

  @ApiProperty({ description: 'Item type', example: 'Exterior' })
  type: string | null;

  @ApiProperty({ description: 'Item price', example: 199.99 })
  price: number;

  @ApiProperty({ description: 'Whether the item can be sold', example: true })
  isSellable: boolean;

  @ApiProperty({
    description: 'Additional remarks',
    example: 'Compatible with 2020-2023 models',
  })
  remarks: string | null;

  @ApiProperty({ description: 'Parent item ID if applicable', example: null })
  parentItemId: number | null;

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

  @ApiProperty({
    description: 'Stock information',
    type: [StockInfoDto],
    required: false,
  })
  @Type(() => StockInfoDto)
  stock?: StockInfoDto[];

  @ApiProperty({
    description: 'Sub-items',
    type: [ItemResponseDto],
    required: false,
  })
  @Type(() => ItemResponseDto)
  subItems?: ItemResponseDto[];

  constructor(
    partial: Partial<Item> & {
      stock?: Partial<Stock>[];
      subItems?: Partial<Item>[];
    },
  ) {
    Object.assign(this, partial);

    if (partial.stock) {
      this.stock = partial.stock.map((s) => new StockInfoDto(s));
    }

    if (partial.subItems) {
      this.subItems = partial.subItems.map((i) => new ItemResponseDto(i));
    }
  }
}
