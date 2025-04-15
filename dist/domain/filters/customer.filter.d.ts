import { PaginationFilter } from './pagination.filter';
export declare class CustomerFilter extends PaginationFilter {
    name?: string;
    phone?: string;
    email?: string;
    hasDebts?: boolean;
    createdAtFrom?: Date;
    createdAtTo?: Date;
    constructor(partial: Partial<CustomerFilter>);
}
