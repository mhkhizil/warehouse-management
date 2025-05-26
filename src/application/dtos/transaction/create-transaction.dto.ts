import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  ValidateIf,
  ValidateNested,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { CreateDebtDto } from '../debt/create-debt.dto';
import { CreateSupplierDebtDto } from '../supplier-debt/create-supplier-debt.dto';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.SELL,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Item ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  itemId: number;

  @ApiProperty({
    description: 'Stock ID (required for BUY transactions)',
    example: 1,
    required: false,
  })
  @ValidateIf((o) => o.type === TransactionType.BUY)
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  stockId?: number;

  @ApiProperty({
    description: 'Customer ID (required for SELL transactions)',
    example: 1,
    required: false,
  })
  @ValidateIf((o) => o.type === TransactionType.SELL)
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  customerId?: number;

  @ApiProperty({
    description: 'Supplier ID (required for BUY transactions)',
    example: 1,
    required: false,
  })
  @ValidateIf((o) => o.type === TransactionType.BUY)
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  supplierId?: number;

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
    description: 'Total amount (unit price * quantity)',
    example: 999.95,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount?: number;

  @ApiProperty({
    description: 'Transaction date',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiProperty({
    description: 'Create debt for this transaction',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  createDebt?: boolean = false;

  @ApiProperty({
    description: 'Debt information (if createDebt is true)',
    type: CreateDebtDto,
    required: false,
  })
  @ValidateIf((o) => o.createDebt === true)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateDebtDto)
  debt?: CreateDebtDto;

  @ApiProperty({
    description: 'Create supplier debt for this transaction',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  createSupplierDebt?: boolean = false;

  @ApiProperty({
    description: 'Supplier debt information (if createSupplierDebt is true)',
    type: CreateSupplierDebtDto,
    required: false,
  })
  @ValidateIf((o) => o.createSupplierDebt === true)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSupplierDebtDto)
  supplierDebt?: CreateSupplierDebtDto;
}
