import { ApiProperty } from '@nestjs/swagger';
import { RefundType } from '@prisma/client';
import {
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRefundItemDto } from './create-refund-item.dto';
import { CreateExchangeItemDto } from './create-exchange-item.dto';

export class CreateRefundDto {
  @ApiProperty({
    description: 'Type of refund',
    enum: RefundType,
    example: RefundType.MONEY_REFUND,
  })
  @IsNotEmpty()
  @IsEnum(RefundType)
  refundType: RefundType;

  @ApiProperty({
    description: 'Reason for the refund',
    example: 'Defective part',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'Items to be refunded',
    type: [CreateRefundItemDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRefundItemDto)
  refundItems: CreateRefundItemDto[];

  @ApiProperty({
    description: 'Items for exchange (only for ITEM_EXCHANGE refund type)',
    type: [CreateExchangeItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExchangeItemDto)
  exchangeItems?: CreateExchangeItemDto[];
}
