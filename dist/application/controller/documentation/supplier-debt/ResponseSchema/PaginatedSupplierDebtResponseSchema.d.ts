import { SupplierDebtResponseSchema } from './SupplierDebtResponseSchema';
export declare class PaginatedSupplierDebtResponseSchema {
    success: boolean;
    data: {
        debts: SupplierDebtResponseSchema[];
        total: number;
    };
    message: string;
}
