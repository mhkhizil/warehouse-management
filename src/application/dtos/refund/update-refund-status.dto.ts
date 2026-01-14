import { ApiProperty } from '@nestjs/swagger';
import { RefundStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRefundStatusDto {
  @ApiProperty({
    description: 'New refund status',
    enum: RefundStatus,
    example: RefundStatus.APPROVED,
  })
  @IsNotEmpty()
  @IsEnum(RefundStatus)
  status: RefundStatus;

  @ApiProperty({
    description: 'Optional reason for status change',
    example: 'Approved by manager - valid warranty claim',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
