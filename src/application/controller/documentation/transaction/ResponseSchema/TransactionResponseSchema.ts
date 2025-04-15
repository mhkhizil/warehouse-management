import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { TransactionResponseDto } from '../../../../dtos/transaction/transaction-response.dto';

class TransactionData {
  @ApiProperty({ type: TransactionResponseDto })
  public transaction: TransactionResponseDto;
}

export class TransactionResponseSchema extends BaseResponseSchema<TransactionData> {
  @ApiProperty({ type: TransactionData })
  public data: TransactionData;

  constructor(transaction: TransactionResponseDto) {
    super();
    this.message = 'Transaction retrieved successfully';
    this.code = 200;
    this.data = { transaction };
  }
}
