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
