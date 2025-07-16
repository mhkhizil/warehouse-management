import { Supplier } from '@prisma/client';
export declare class SupplierResponseDto implements Partial<Supplier> {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    contactPerson: string | null;
    isActive: boolean;
    remarks: string | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Supplier>);
}
