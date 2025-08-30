import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Min, IsInt } from 'class-validator';

export class CreateRefundItemDto {
  @ApiProperty({
    description: 'ID of the original transaction item being refunded',
    example: 123,
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  originalTransactionItemId: number;

  @ApiProperty({
    description: 'Quantity to refund (must not exceed original quantity)',
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantityToRefund: number;

  @ApiProperty({
    description: 'Refund amount for this item',
    example: 150.0,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  refundAmount: number;
}
