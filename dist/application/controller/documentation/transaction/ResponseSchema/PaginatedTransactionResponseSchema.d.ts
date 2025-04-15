import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { TransactionResponseDto } from '../../../../dtos/transaction/transaction-response.dto';
import { PaginatedResponseDto } from '../../../../dtos/common/pagination.dto';
declare class PaginatedTransactionData {
    transactions: PaginatedResponseDto<TransactionResponseDto>;
}
export declare class PaginatedTransactionResponseSchema extends BaseResponseSchema<PaginatedTransactionData> {
    data: PaginatedTransactionData;
    constructor(transactions: PaginatedResponseDto<TransactionResponseDto>);
}
export {};
