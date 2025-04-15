import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { DebtResponseDto } from '../../../../dtos/debt/debt-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';
declare class PaginatedDebtData {
    debts: PaginatedResponseDto<DebtResponseDto>;
}
export declare class PaginatedDebtResponseSchema extends BaseResponseSchema<PaginatedDebtData> {
    data: PaginatedDebtData;
    constructor(debts: PaginatedResponseDto<DebtResponseDto>);
}
export {};
