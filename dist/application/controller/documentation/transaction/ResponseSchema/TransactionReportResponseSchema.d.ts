import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { TransactionResponseDto } from '../../../../dtos/transaction/transaction-response.dto';
declare class TransactionReportData {
    totalAmount: number;
    transactions: TransactionResponseDto[];
}
export declare class TransactionReportResponseSchema extends BaseResponseSchema<TransactionReportData> {
    data: TransactionReportData;
    constructor(totalAmount: number, transactions: TransactionResponseDto[]);
}
export {};
