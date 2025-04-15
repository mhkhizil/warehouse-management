import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { TransactionResponseDto } from '../../../../dtos/transaction/transaction-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';

class PaginatedTransactionData {
  @ApiProperty({ type: () => PaginatedResponseDto<TransactionResponseDto> })
  public transactions: PaginatedResponseDto<TransactionResponseDto>;
}

export class PaginatedTransactionResponseSchema extends BaseResponseSchema<PaginatedTransactionData> {
  @ApiProperty({ type: PaginatedTransactionData })
  public data: PaginatedTransactionData;

  constructor(transactions: PaginatedResponseDto<TransactionResponseDto>) {
    super();
    this.message = 'Transactions retrieved successfully';
    this.code = 200;
    this.data = { transactions };
  }
}
