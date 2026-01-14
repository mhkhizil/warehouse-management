import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  SupplierSortBy,
  SortOrder,
} from '../../domain/filters/supplier.filter';

export class SupplierFilterDto {
  @ApiProperty({
    description: 'Filter by supplier name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Filter by email',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Filter by phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Filter by address',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Filter by contact person',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactPerson?: string;
  @ApiProperty({
    description: 'Filter by active status',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'Field to sort by',
    required: false,
    default: 'createdAt',
    enum: SupplierSortBy,
  })
  @IsEnum(SupplierSortBy)
  @IsOptional()
  sortBy?: SupplierSortBy = SupplierSortBy.CREATED_AT;

  @ApiProperty({
    description: 'Sort order',
    required: false,
    default: 'desc',
    enum: SortOrder,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;

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
