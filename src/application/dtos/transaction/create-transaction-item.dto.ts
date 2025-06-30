import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateTransactionItemDto {
  @ApiProperty({
    description: 'Item ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  itemId: number;

  @ApiProperty({
    description: 'Stock ID (optional, auto-assigned for BUY transactions)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  stockId?: number;

  @ApiProperty({
    description: 'Quantity of items',
    example: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'Unit price',
    example: 199.99,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;

  @ApiProperty({
    description:
      'Total amount (quantity * unitPrice) - auto-calculated if not provided',
    example: 999.95,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount?: number;
}
