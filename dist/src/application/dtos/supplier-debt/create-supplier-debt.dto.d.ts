export declare class CreateSupplierDebtDto {
    supplierId: number;
    amount: number;
    dueDate: string;
    isSettled?: boolean;
    transactionId?: number;
    remarks?: string;
}
