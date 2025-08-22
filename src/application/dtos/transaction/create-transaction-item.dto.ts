import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  IsBoolean,
  IsString,
  IsDateString,
  ValidateIf,
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

  // Warranty fields (optional)
  @ApiProperty({
    description: 'Whether this item has warranty',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hasWarranty?: boolean = false;

  @ApiProperty({
    description:
      'Warranty duration in months (required if hasWarranty is true)',
    example: 12,
    required: false,
  })
  @ValidateIf((o) => o.hasWarranty === true)
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  warrantyDurationMonths?: number;

  @ApiProperty({
    description:
      'Warranty start date (defaults to transaction date if not provided)',
    example: '2024-08-22T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  warrantyStartDate?: string;

  @ApiProperty({
    description: 'Warranty end date (auto-calculated if not provided)',
    example: '2025-08-22T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  warrantyEndDate?: string;

  @ApiProperty({
    description: 'Additional warranty details or terms',
    example: 'Manufacturer warranty covering parts and labor',
    required: false,
  })
  @IsOptional()
  @IsString()
  warrantyDescription?: string;
}
