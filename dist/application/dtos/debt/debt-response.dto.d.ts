import { Debt, Customer } from '@prisma/client';
import { CustomerResponseDto } from '../customer/customer-response.dto';
export declare class DebtResponseDto {
    id: number;
    customerId: number;
    customer?: CustomerResponseDto;
    amount: number;
    dueDate: Date;
    isSettled: boolean;
    alertSent: boolean;
    remarks: string | null;
    transactionId: number | null;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Debt> & {
        customer?: Partial<Customer>;
    });
}
