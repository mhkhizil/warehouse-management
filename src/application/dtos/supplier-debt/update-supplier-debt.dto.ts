import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateSupplierDebtDto {
  @ApiProperty({
    description: 'Debt amount',
    example: 500.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Due date for the debt',
    example: '2023-12-31T00:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({
    description: 'Is the debt settled',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isSettled?: boolean;

  @ApiProperty({
    description: 'Has alert been sent',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  alertSent?: boolean;

  @ApiProperty({
    description: 'Additional remarks about the debt',
    example: 'Partial payment received',
    required: false,
  })
  @IsString()
  @IsOptional()
  remarks?: string;
}
