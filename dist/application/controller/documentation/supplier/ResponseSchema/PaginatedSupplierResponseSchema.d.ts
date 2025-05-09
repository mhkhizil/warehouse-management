import { SupplierResponseSchema } from './SupplierResponseSchema';
export declare class PaginatedSupplierResponseSchema {
    success: boolean;
    data: {
        suppliers: SupplierResponseSchema[];
        total: number;
    };
    message: string;
}
