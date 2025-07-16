import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { TransactionResponseDto } from '../../../../dtos/transaction/transaction-response.dto';
declare class TransactionListData {
    transactions: TransactionResponseDto[];
}
export declare class TransactionListResponseSchema extends BaseResponseSchema<TransactionListData> {
    data: TransactionListData;
    constructor(transactions: TransactionResponseDto[]);
}
export {};
