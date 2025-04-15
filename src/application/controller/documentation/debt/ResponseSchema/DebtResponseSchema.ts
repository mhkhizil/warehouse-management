import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { DebtResponseDto } from '../../../../dtos/debt/debt-response.dto';

class DebtData {
  @ApiProperty({ type: DebtResponseDto })
  public debt: DebtResponseDto;
}

export class DebtResponseSchema extends BaseResponseSchema<DebtData> {
  @ApiProperty({ type: DebtData })
  public data: DebtData;

  constructor(debt: DebtResponseDto) {
    super();
    this.message = 'Debt retrieved successfully';
    this.code = 200;
    this.data = { debt };
  }
}
