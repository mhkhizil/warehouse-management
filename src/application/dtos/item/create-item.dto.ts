import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ description: 'Item name', example: 'Car Bumper Model X123' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Item brand',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({
    description: 'Item type',
    example: 'Exterior',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: 'Item price', example: 199.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Whether the item can be sold', default: true })
  @IsOptional()
  @IsBoolean()
  isSellable?: boolean = true;

  @ApiProperty({
    description: 'Additional remarks about the item',
    required: false,
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty({ description: 'Parent item ID for sub-items', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentItemId?: number;

  @ApiProperty({ description: 'Initial stock quantity', required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  initialQuantity?: number;

  @ApiProperty({ description: 'Whether to set a refill alert', default: false })
  @IsOptional()
  @IsBoolean()
  refillAlert?: boolean = false;
}
