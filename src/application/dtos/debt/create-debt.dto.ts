import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateDebtDto {
  @ApiProperty({
    description: 'Customer ID associated with this debt',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  customerId: number;

  @ApiProperty({
    description: 'Debt amount',
    example: 150.0,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Due date for debt payment',
    example: '2023-02-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty({
    description: 'Optional remarks about the debt',
    example: 'Payment for order #12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiProperty({
    description: 'Transaction ID if debt is related to a transaction',
    example: 42,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  transactionId?: number;

  @ApiProperty({
    description: 'Whether the debt is settled',
    example: false,
    required: false,
  })
  @IsOptional()
  isSettled?: boolean;

  @ApiProperty({
    description: 'Whether alert has been sent for this debt',
    example: false,
    required: false,
  })
  @IsOptional()
  alertSent?: boolean;
}
