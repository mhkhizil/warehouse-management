import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { TransactionResponseDto } from '../../../../dtos/transaction/transaction-response.dto';

class TransactionReportData {
  @ApiProperty({ type: 'number', example: 10000 })
  public totalAmount: number;

  @ApiProperty({ type: [TransactionResponseDto] })
  public transactions: TransactionResponseDto[];
}

export class TransactionReportResponseSchema extends BaseResponseSchema<TransactionReportData> {
  @ApiProperty({ type: TransactionReportData })
  public data: TransactionReportData;

  constructor(totalAmount: number, transactions: TransactionResponseDto[]) {
    super();
    this.message = 'Transaction report generated successfully';
    this.code = 200;
    this.data = { totalAmount, transactions };
  }
}
