import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { CustomerResponseDto } from '../../../../dtos/customer/customer-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';

class PaginatedCustomerData {
  @ApiProperty({ type: () => PaginatedResponseDto<CustomerResponseDto> })
  public customers: PaginatedResponseDto<CustomerResponseDto>;
}

export class PaginatedCustomerResponseSchema extends BaseResponseSchema<PaginatedCustomerData> {
  @ApiProperty({ type: PaginatedCustomerData })
  public data: PaginatedCustomerData;

  constructor(customers: PaginatedResponseDto<CustomerResponseDto>) {
    super();
    this.message = 'Customers retrieved successfully';
    this.code = 200;
    this.data = { customers };
  }
} 