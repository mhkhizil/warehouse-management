import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateExchangeItemDto {
  @ApiProperty({
    description: 'ID of the item to exchange for',
    example: 456,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  itemId: number;

  @ApiProperty({
    description: 'Quantity of the new item',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Unit price of the new item',
    example: 200.0,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;

  @ApiProperty({
    description: 'Total amount for this exchange item (quantity * unitPrice)',
    example: 200.0,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: 'Whether the new item has warranty',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasWarranty?: boolean;

  @ApiProperty({
    description: 'Warranty duration in months',
    example: 12,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  warrantyDurationMonths?: number;

  @ApiProperty({
    description: 'Warranty start date (ISO 8601 format)',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  warrantyStartDate?: string;

  @ApiProperty({
    description: 'Warranty end date (ISO 8601 format)',
    example: '2025-01-15T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  warrantyEndDate?: string;

  @ApiProperty({
    description: 'Warranty description or terms',
    example: '1 year manufacturer warranty',
    required: false,
  })
  @IsOptional()
  @IsString()
  warrantyDescription?: string;
}
