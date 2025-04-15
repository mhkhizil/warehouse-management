import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { CustomerResponseDto } from '../../../../dtos/customer/customer-response.dto';

class CustomerListData {
  @ApiProperty({ type: [CustomerResponseDto] })
  public customers: CustomerResponseDto[];
}

export class CustomerListResponseSchema extends BaseResponseSchema<CustomerListData> {
  @ApiProperty({ type: CustomerListData })
  public data: CustomerListData;

  constructor(customers: CustomerResponseDto[]) {
    super();
    this.message = 'Customers retrieved successfully';
    this.code = 200;
    this.data = { customers };
  }
} 