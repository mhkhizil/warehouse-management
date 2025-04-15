export declare class PaginationQueryDto {
    skip?: number;
    take?: number;
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    constructor(data: T[], total: number, skip: number, take: number);
}
