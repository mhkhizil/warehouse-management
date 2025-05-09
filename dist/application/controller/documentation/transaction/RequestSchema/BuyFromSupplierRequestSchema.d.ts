export declare class BuyFromSupplierRequestSchema {
    supplierId: number;
    itemId: number;
    quantity: number;
    unitPrice: number;
    createDebt?: boolean;
    debtDueDate?: string;
    debtRemarks?: string;
}
