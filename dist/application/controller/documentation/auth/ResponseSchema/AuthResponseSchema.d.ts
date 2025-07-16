import { BaseResponseSchema } from '../../common/BaseResponseSchema';
declare class AuthResponse {
    token: string;
}
export declare class AuthResponseSchema extends BaseResponseSchema<AuthResponse> {
    data: AuthResponse;
    constructor(token: string);
}
export {};
