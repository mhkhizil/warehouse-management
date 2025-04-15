import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { DebtResponseDto } from '../../../../dtos/debt/debt-response.dto';
declare class DebtData {
    debt: DebtResponseDto;
}
export declare class DebtResponseSchema extends BaseResponseSchema<DebtData> {
    data: DebtData;
    constructor(debt: DebtResponseDto);
}
export {};
