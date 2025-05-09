export declare class SupplierDebtResponseSchema {
    id: number;
    supplierId: number;
    amount: number;
    dueDate: Date;
    isSettled: boolean;
    alertSent: boolean;
    transactionId: number;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
    supplier?: {
        id: number;
        name: string;
    };
}
