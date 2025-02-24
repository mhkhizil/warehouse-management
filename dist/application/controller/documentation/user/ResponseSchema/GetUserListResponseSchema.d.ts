import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { GetUserResponse } from './GetUserResponseSchema';
export declare class GetUserListResponse {
    users: GetUserResponse[];
    totalCounts: number;
}
export declare class GetUserListResponseSchema extends BaseResponseSchema<GetUserListResponse> {
    data: GetUserListResponse;
}
