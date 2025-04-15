import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { CustomerResponseDto } from '../../../../dtos/customer/customer-response.dto';

class CustomerData {
  @ApiProperty({ type: CustomerResponseDto })
  public customer: CustomerResponseDto;
}

export class CustomerResponseSchema extends BaseResponseSchema<CustomerData> {
  @ApiProperty({ type: CustomerData })
  public data: CustomerData;

  constructor(customer: CustomerResponseDto) {
    super();
    this.message = 'Customer retrieved successfully';
    this.code = 200;
    this.data = { customer };
  }
}
