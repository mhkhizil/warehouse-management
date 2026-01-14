import { ApiProperty } from '@nestjs/swagger';
import { RefundType, RefundStatus, Refund } from '@prisma/client';

export class RefundItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  originalTransactionItemId: number;

  @ApiProperty()
  quantityToRefund: number;

  @ApiProperty()
  refundAmount: number;

  @ApiProperty()
  isWarrantyValid: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ExchangeItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  itemId: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  hasWarranty: boolean;

  @ApiProperty({ required: false })
  warrantyDurationMonths?: number;

  @ApiProperty({ required: false })
  warrantyStartDate?: Date;

  @ApiProperty({ required: false })
  warrantyEndDate?: Date;

  @ApiProperty({ required: false })
  warrantyDescription?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class RefundResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: RefundType })
  refundType: RefundType;

  @ApiProperty()
  originalTransactionId: number;

  @ApiProperty({ required: false })
  refundTransactionId?: number;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  totalRefundAmount: number;

  @ApiProperty({ required: false })
  reason?: string;

  @ApiProperty({ enum: RefundStatus })
  status: RefundStatus;

  @ApiProperty({ type: [RefundItemResponseDto] })
  refundItems: RefundItemResponseDto[];

  @ApiProperty({ type: [ExchangeItemResponseDto] })
  exchangeItems: ExchangeItemResponseDto[];

  @ApiProperty({ required: false })
  exchangeAmountDue?: number;

  @ApiProperty({ required: false })
  processedAt?: Date;

  @ApiProperty({ required: false })
  processedBy?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(refund: any) {
    this.id = refund.id;
    this.refundType = refund.refundType;
    this.originalTransactionId = refund.originalTransactionId;
    this.refundTransactionId = refund.refundTransactionId;
    this.customerId = refund.customerId;
    this.totalRefundAmount = refund.totalRefundAmount;
    this.reason = refund.reason;
    this.status = refund.status;
    this.refundItems = refund.refundItems || [];
    this.exchangeItems = refund.exchangeItems || [];
    this.exchangeAmountDue = refund.exchangeAmountDue;
    this.processedAt = refund.processedAt;
    this.processedBy = refund.processedBy;
    this.createdAt = refund.createdAt;
    this.updatedAt = refund.updatedAt;
  }
}

