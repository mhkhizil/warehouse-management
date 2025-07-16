import { UserRole } from 'src/core/common/type/UserEnum';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
declare class CreateUserResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    createdDate: string;
    updatedDate: string;
}
export declare class CreateUserResonseSchema extends BaseResponseSchema<CreateUserResponse> {
    data: CreateUserResponse;
}
export {};
