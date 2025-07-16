export declare class ApiResponseDto<T> {
    success: boolean;
    message: string;
    data: T | null;
    error: string | null;
    constructor(success: boolean, message: string, data?: T | null, error?: string | null);
    static success<T>(data: T, message?: string): ApiResponseDto<T>;
    static error<T>(message: string, error?: string | null): ApiResponseDto<T>;
}
