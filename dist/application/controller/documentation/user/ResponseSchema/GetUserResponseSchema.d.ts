import { UserRole } from 'src/core/common/type/UserEnum';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
export declare class GetUserResponse {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdDate: Date;
    updatedDate: Date;
}
export declare class GetUserResonseSchema extends BaseResponseSchema<GetUserResponse> {
    data: GetUserResponse;
}
