import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateSupplierDebtDto {
  @ApiProperty({
    description: 'Supplier ID',
    example: 1,
  })
  @IsNumber()
  supplierId: number;

  @ApiProperty({
    description: 'Debt amount',
    example: 500.0,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Due date for the debt',
    example: '2023-12-31T00:00:00Z',
  })
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    description: 'Is the debt settled',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isSettled?: boolean;

  @ApiProperty({
    description: 'Related transaction ID',
    example: 123,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  transactionId?: number;

  @ApiProperty({
    description: 'Additional remarks about the debt',
    example: 'For emergency purchase of spare parts',
    required: false,
  })
  @IsString()
  @IsOptional()
  remarks?: string;
}
