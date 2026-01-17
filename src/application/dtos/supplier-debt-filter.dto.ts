import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNumber, IsDateString, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {
  SupplierDebtSortBy,
  SortOrder,
} from '../../domain/filters/supplier-debt.filter';

export class SupplierDebtFilterDto {
  @ApiProperty({
    description: 'Filter by supplier ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  supplierId?: number;

  @ApiProperty({
    description: 'Filter by supplier name (partial match, case-insensitive)',
    required: false,
  })
  @IsString()
  @IsOptional()
  supplierName?: string;

  @ApiProperty({
    description: 'Filter by settlement status',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isSettled?: boolean;

  @ApiProperty({
    description: 'Filter for overdue debts (past due date, not settled)',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  overdue?: boolean;

  @ApiProperty({
    description: 'Filter for debts due within 3 days (not settled)',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  farFromDue?: boolean;

  @ApiProperty({
    description: 'Filter for debts due today (not settled)',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  dueToday?: boolean;

  @ApiProperty({
    description: 'Filter debts due before this date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueBefore?: string;

  @ApiProperty({
    description: 'Filter debts due after this date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueAfter?: string;

  @ApiProperty({
    description: 'Filter debts created from this date (ISO format)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  createdAtFrom?: string;

  @ApiProperty({
    description: 'Filter debts created until this date (ISO format)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  createdAtTo?: string;

  @ApiProperty({
    description: 'Filter debts updated from this date (ISO format)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  updatedAtFrom?: string;

  @ApiProperty({
    description: 'Filter debts updated until this date (ISO format)',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  updatedAtTo?: string;

  @ApiProperty({
    description: 'Field to sort by',
    required: false,
    default: 'dueDate',
    enum: SupplierDebtSortBy,
  })
  @IsEnum(SupplierDebtSortBy)
  @IsOptional()
  sortBy?: SupplierDebtSortBy = SupplierDebtSortBy.DUE_DATE;

  @ApiProperty({
    description: 'Sort order',
    required: false,
    default: 'asc',
    enum: SortOrder,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.ASC;

  @ApiProperty({
    description: 'Number of records to fetch',
    required: false,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  take?: number = 10;

  @ApiProperty({
    description: 'Number of records to skip',
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number = 0;
}
