import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateStockDto {
  @ApiProperty({
    description: 'Item ID associated with this stock',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  itemId: number;

  @ApiProperty({
    description: 'Initial stock quantity',
    example: 50,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quantity?: number = 0;

  @ApiProperty({
    description: 'Last refill date',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  lastRefilled?: Date;

  @ApiProperty({
    description: 'Whether to set refill alert',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  refillAlert?: boolean = false;
}
