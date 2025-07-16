import { CreateDebtDto } from './create-debt.dto';
declare const UpdateDebtDto_base: import("@nestjs/common").Type<Partial<Omit<CreateDebtDto, "transactionId" | "customerId">>>;
export declare class UpdateDebtDto extends UpdateDebtDto_base {
    isSettled?: boolean;
    alertSent?: boolean;
}
export {};
