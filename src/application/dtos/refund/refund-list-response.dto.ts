import { ApiProperty } from '@nestjs/swagger';
import { RefundResponseDto } from './refund-response.dto';

export class RefundListResponseDto {
  @ApiProperty({ type: [RefundResponseDto] })
  refunds: RefundResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  constructor(refunds: any[], total: number, page: number, limit: number) {
    this.refunds = refunds.map((refund) => new RefundResponseDto(refund));
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}

