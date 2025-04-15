import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { DebtResponseDto } from '../../../../dtos/debt/debt-response.dto';
declare class DebtListData {
    debts: DebtResponseDto[];
}
export declare class DebtListResponseSchema extends BaseResponseSchema<DebtListData> {
    data: DebtListData;
    constructor(debts: DebtResponseDto[]);
}
export {};
