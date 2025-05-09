import { CreateTransactionDto } from './create-transaction.dto';
declare const UpdateTransactionDto_base: import("@nestjs/common").Type<Partial<Omit<CreateTransactionDto, "type" | "createDebt" | "debt">>>;
export declare class UpdateTransactionDto extends UpdateTransactionDto_base {
}
export {};
