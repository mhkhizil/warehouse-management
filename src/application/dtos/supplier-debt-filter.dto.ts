import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

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
    description: 'Filter by settlement status',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isSettled?: boolean;

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
