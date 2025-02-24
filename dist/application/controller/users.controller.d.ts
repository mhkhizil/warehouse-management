import { CreateUserUseCase } from 'src/core/domain/user/service/CreateUserUsecase';
import { CoreApiResonseSchema } from 'src/core/common/schema/ApiResponseSchema';
import { GetUserUseCase } from 'src/core/domain/user/service/GetUserUsecase';
import { GetUserListWithFilterUseCase } from '@src/core/domain/user/service/GetUserListUsecase';
import { UserFilterSchama } from './documentation/user/RequsetSchema/UserFilterSchema';
import { UpdateUserRequestSchema } from './documentation/user/RequsetSchema/UpdateUserRequestSchema';
import { UpdateUserUseCase } from '@src/core/domain/user/service/UpdateUserUseCase';
export declare class UsersController {
    private getUserUseCase;
    private createUserUseCase;
    private getUserListWithFilter;
    private updateUserUseCase;
    constructor(getUserUseCase: GetUserUseCase, createUserUseCase: CreateUserUseCase, getUserListWithFilter: GetUserListWithFilterUseCase, updateUserUseCase: UpdateUserUseCase);
    findOne(req: any): Promise<CoreApiResonseSchema<any>>;
    findOneById(req: any, params: {
        id: string;
    }): Promise<CoreApiResonseSchema<any>>;
    getAllByFilter(params: UserFilterSchama): Promise<CoreApiResonseSchema<any>>;
    updateUser(user: UpdateUserRequestSchema, params: {
        id: string;
    }): Promise<CoreApiResonseSchema<any>>;
}
