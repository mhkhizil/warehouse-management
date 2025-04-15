import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { CustomerResponseDto } from '../../../../dtos/customer/customer-response.dto';
declare class CustomerListData {
    customers: CustomerResponseDto[];
}
export declare class CustomerListResponseSchema extends BaseResponseSchema<CustomerListData> {
    data: CustomerListData;
    constructor(customers: CustomerResponseDto[]);
}
export {};
