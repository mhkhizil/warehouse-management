import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { DebtResponseDto } from '../../../../dtos/debt/debt-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';

class PaginatedDebtData {
  @ApiProperty({ type: () => PaginatedResponseDto<DebtResponseDto> })
  public debts: PaginatedResponseDto<DebtResponseDto>;
}

export class PaginatedDebtResponseSchema extends BaseResponseSchema<PaginatedDebtData> {
  @ApiProperty({ type: PaginatedDebtData })
  public data: PaginatedDebtData;

  constructor(debts: PaginatedResponseDto<DebtResponseDto>) {
    super();
    this.message = 'Debts retrieved successfully';
    this.code = 200;
    this.data = { debts };
  }
}
