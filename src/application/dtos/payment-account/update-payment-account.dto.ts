import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentAccountDto {
  @ApiPropertyOptional({
    description: 'Name of the payment account',
    example: 'Main Business Account',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  accountName?: string;

  @ApiPropertyOptional({
    description: 'Type of payment account',
    example: 'Bank Account',
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  accountType?: string;

  @ApiPropertyOptional({
    description: 'Account number or identifier',
    example: '1234567890',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  accountNumber?: string;

  @ApiPropertyOptional({
    description: 'Bank or financial institution name',
    example: 'ABC Bank',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankName?: string;

  @ApiPropertyOptional({
    description: 'Account holder name',
    example: 'John Doe Business',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  accountHolder?: string;

  @ApiPropertyOptional({
    description: 'Additional description about the account',
    example: 'Primary account for online transactions',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the account is active for transactions',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Account balance (optional for tracking)',
    example: 10000.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  balance?: number;
}
