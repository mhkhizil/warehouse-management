import { Supplier } from '@prisma/client';
export declare class SupplierResponseDto implements Partial<Supplier> {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    contactPerson: string;
    isActive: boolean;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Supplier>);
}
