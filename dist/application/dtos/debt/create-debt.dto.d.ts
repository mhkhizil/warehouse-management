export declare class CreateDebtDto {
    customerId: number;
    amount: number;
    dueDate: Date;
    remarks?: string;
    transactionId?: number;
    isSettled?: boolean;
    alertSent?: boolean;
}
