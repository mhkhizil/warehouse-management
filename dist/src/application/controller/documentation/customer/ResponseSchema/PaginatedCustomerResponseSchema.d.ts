import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { CustomerResponseDto } from '../../../../dtos/customer/customer-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';
declare class PaginatedCustomerData {
    customers: PaginatedResponseDto<CustomerResponseDto>;
}
export declare class PaginatedCustomerResponseSchema extends BaseResponseSchema<PaginatedCustomerData> {
    data: PaginatedCustomerData;
    constructor(customers: PaginatedResponseDto<CustomerResponseDto>);
}
export {};
