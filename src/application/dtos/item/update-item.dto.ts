import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiProperty({
    description:
      'Stock quantity to update (if you want to update quantity directly)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stockQuantity?: number;
}
