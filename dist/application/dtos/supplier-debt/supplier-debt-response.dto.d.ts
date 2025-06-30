import { SupplierDebt, Supplier } from '@prisma/client';
import { SupplierResponseDto } from '../supplier/supplier-response.dto';
interface SupplierDebtWithRelations extends SupplierDebt {
    supplier?: Supplier;
}
export declare class SupplierDebtResponseDto implements Partial<SupplierDebt> {
    id: number;
    supplierId: number;
    supplier?: SupplierResponseDto;
    amount: number;
    dueDate: Date;
    isSettled: boolean;
    alertSent: boolean;
    transactionId: number | null;
    remarks: string | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<SupplierDebtWithRelations>);
}
export {};
