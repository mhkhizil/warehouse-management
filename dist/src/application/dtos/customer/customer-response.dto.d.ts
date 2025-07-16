import { Customer, Debt } from '@prisma/client';
export declare class CustomerDebtDto implements Partial<Debt> {
    id: number;
    amount: number;
    dueDate: Date;
    isSettled: boolean;
    alertSent: boolean;
    transactionId: number | null;
    remarks: string | null;
    constructor(partial: Partial<Debt>);
}
export declare class CustomerResponseDto implements Partial<Customer> {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    debt?: CustomerDebtDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Customer> & {
        debt?: Partial<Debt>[];
    });
}
