import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { TransactionResponseDto } from '../../../../dtos/transaction/transaction-response.dto';
declare class TransactionData {
    transaction: TransactionResponseDto;
}
export declare class TransactionResponseSchema extends BaseResponseSchema<TransactionData> {
    data: TransactionData;
    constructor(transaction: TransactionResponseDto);
}
export {};
