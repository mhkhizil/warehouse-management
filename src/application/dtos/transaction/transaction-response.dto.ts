import { ApiProperty } from '@nestjs/swagger';
import {
  Customer,
  Debt,
  Item,
  Stock,
  Transaction,
  TransactionType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import { CustomerResponseDto } from '../customer/customer-response.dto';
import { DebtResponseDto } from '../debt/debt-response.dto';
import { ItemResponseDto } from '../item/item-response.dto';
import { StockResponseDto } from '../stock/stock-response.dto';

// Define interface with relations
interface TransactionWithRelations extends Transaction {
  item?: Item;
  stock?: Stock;
  customer?: Customer;
  debt?: Debt[];
}

export class TransactionResponseDto implements Partial<Transaction> {
  @ApiProperty({ description: 'Transaction ID', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.SELL,
  })
  type: TransactionType;

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

  @ApiProperty({ description: 'Customer ID', example: 1, required: false })
  customerId: number | null;

  @ApiProperty({
    description: 'Customer information',
    type: CustomerResponseDto,
    required: false,
  })
  @Type(() => CustomerResponseDto)
  customer?: CustomerResponseDto;

  @ApiProperty({ description: 'Quantity', example: 5 })
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 199.99 })
  unitPrice: number;

  @ApiProperty({ description: 'Total amount', example: 999.95 })
  totalAmount: number;

  @ApiProperty({
    description: 'Transaction date',
    example: '2023-01-01T00:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Associated debt records',
    type: [DebtResponseDto],
    required: false,
  })
  @Type(() => DebtResponseDto)
  debt?: DebtResponseDto[];

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

  constructor(
    partial: Partial<Transaction> & {
      item?: Partial<Item>;
      stock?: Partial<Stock>;
      customer?: Partial<Customer>;
      debt?: Partial<Debt>[];
    },
  ) {
    Object.assign(this, partial);

    if (partial.item) {
      this.item = new ItemResponseDto(partial.item);
    }

    if (partial.stock) {
      this.stock = new StockResponseDto(partial.stock);
    }

    if (partial.customer) {
      this.customer = new CustomerResponseDto(partial.customer);
    }

    if (partial.debt && Array.isArray(partial.debt)) {
      this.debt = partial.debt.map((debt) => new DebtResponseDto(debt));
    }
  }
}
