import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { CustomerResponseDto } from '../../../../dtos/customer/customer-response.dto';
declare class CustomerData {
    customer: CustomerResponseDto;
}
export declare class CustomerResponseSchema extends BaseResponseSchema<CustomerData> {
    data: CustomerData;
    constructor(customer: CustomerResponseDto);
}
export {};
