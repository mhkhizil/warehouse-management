import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateStockDto } from './create-stock.dto';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateStockDto extends PartialType(
  OmitType(CreateStockDto, ['itemId'] as const),
) {
  @ApiProperty({
    description: 'Quantity to add (positive) or remove (negative)',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  quantityChange?: number;
}
