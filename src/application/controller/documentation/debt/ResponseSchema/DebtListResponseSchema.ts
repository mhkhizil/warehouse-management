import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { DebtResponseDto } from '../../../../dtos/debt/debt-response.dto';

class DebtListData {
  @ApiProperty({ type: [DebtResponseDto] })
  public debts: DebtResponseDto[];
}

export class DebtListResponseSchema extends BaseResponseSchema<DebtListData> {
  @ApiProperty({ type: DebtListData })
  public data: DebtListData;

  constructor(debts: DebtResponseDto[]) {
    super();
    this.message = 'Debts retrieved successfully';
    this.code = 200;
    this.data = { debts };
  }
} 