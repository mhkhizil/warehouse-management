import { ApiProperty } from '@nestjs/swagger';
import { Item, Stock, TransactionItem } from '@prisma/client';
import { Type } from 'class-transformer';
import { ItemResponseDto } from '../item/item-response.dto';
import { StockResponseDto } from '../stock/stock-response.dto';

// Define interface with relations
interface TransactionItemWithRelations extends TransactionItem {
  item?: Item;
  stock?: Stock;
}

export class TransactionItemResponseDto implements Partial<TransactionItem> {
  @ApiProperty({ description: 'Transaction Item ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Transaction ID', example: 1 })
  transactionId: number;

  @ApiProperty({ description: 'Item ID', example: 1 })
  itemId: number;

  @ApiProperty({
    description: 'Item information',
    type: ItemResponseDto,
  })
  @Type(() => ItemResponseDto)
  item?: ItemResponseDto;

  @ApiProperty({ description: 'Stock ID', example: 1, required: false })
  stockId: number | null;

  @ApiProperty({
    description: 'Stock information',
    type: StockResponseDto,
    required: false,
  })
  @Type(() => StockResponseDto)
  stock?: StockResponseDto;

  @ApiProperty({ description: 'Quantity', example: 5 })
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 199.99 })
  unitPrice: number;

  @ApiProperty({ description: 'Total amount', example: 999.95 })
  totalAmount: number;

  // Warranty fields
  @ApiProperty({
    description: 'Whether this item has warranty',
    example: true,
  })
  hasWarranty: boolean;

  @ApiProperty({
    description: 'Warranty duration in months',
    example: 12,
    required: false,
  })
  warrantyDurationMonths: number | null;

  @ApiProperty({
    description: 'Warranty start date',
    example: '2024-08-22T00:00:00Z',
    required: false,
  })
  warrantyStartDate: Date | null;

  @ApiProperty({
    description: 'Warranty end date',
    example: '2025-08-22T00:00:00Z',
    required: false,
  })
  warrantyEndDate: Date | null;

  @ApiProperty({
    description: 'Additional warranty details or terms',
    example: 'Manufacturer warranty covering parts and labor',
    required: false,
  })
  warrantyDescription: string | null;

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

  constructor(partial: Partial<TransactionItemWithRelations>) {
    Object.assign(this, partial);

    if (partial.item) {
      this.item = new ItemResponseDto(partial.item);
    }

    if (partial.stock) {
      this.stock = new StockResponseDto(partial.stock);
    }
  }
}
