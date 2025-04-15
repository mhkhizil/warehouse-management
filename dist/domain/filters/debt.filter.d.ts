import { PaginationFilter } from './pagination.filter';
export declare class DebtFilter extends PaginationFilter {
    customerId?: number;
    isSettled?: boolean;
    alertSent?: boolean;
    dueBefore?: Date;
    dueAfter?: Date;
    constructor(partial: Partial<DebtFilter>);
}
