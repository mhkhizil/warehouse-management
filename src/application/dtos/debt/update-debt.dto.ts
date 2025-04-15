import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateDebtDto } from './create-debt.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDebtDto extends PartialType(
  OmitType(CreateDebtDto, ['customerId', 'transactionId'] as const),
) {
  @ApiProperty({
    description: 'Mark debt as settled',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isSettled?: boolean;

  @ApiProperty({
    description: 'Mark alert as sent',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  alertSent?: boolean;
}
