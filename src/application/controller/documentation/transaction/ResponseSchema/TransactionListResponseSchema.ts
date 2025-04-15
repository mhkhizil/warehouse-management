import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { TransactionResponseDto } from '../../../../dtos/transaction/transaction-response.dto';

class TransactionListData {
  @ApiProperty({ type: [TransactionResponseDto] })
  public transactions: TransactionResponseDto[];
}

export class TransactionListResponseSchema extends BaseResponseSchema<TransactionListData> {
  @ApiProperty({ type: TransactionListData })
  public data: TransactionListData;

  constructor(transactions: TransactionResponseDto[]) {
    super();
    this.message = 'Transactions retrieved successfully';
    this.code = 200;
    this.data = { transactions };
  }
}
