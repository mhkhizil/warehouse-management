import { CreateUserUseCase } from 'src/core/domain/user/service/CreateUserUsecase';
import { CoreApiResonseSchema } from 'src/core/common/schema/ApiResponseSchema';
import { GetUserUseCase } from 'src/core/domain/user/service/GetUserUsecase';
import { GetUserListWithFilterUseCase } from '@src/core/domain/user/service/GetUserListUsecase';
import { UserFilterSchama } from './documentation/user/RequsetSchema/UserFilterSchema';
import { UpdateUserRequestSchema } from './documentation/user/RequsetSchema/UpdateUserRequestSchema';
import { UpdateUserUseCase } from '@src/core/domain/user/service/UpdateUserUseCase';
import { PrismaService } from '@src/core/common/prisma/PrismaService';
import { UpdateProfileUseCase } from '@src/core/domain/user/service/UpdateProfileUseCase';
import { UpdateProfileRequestSchema } from './documentation/user/RequsetSchema/UpdateProfileRequestSchema';
import { DeleteUserUseCase } from '@src/core/domain/user/service/DeleteUserUseCase';
import { LocalFileUploadService } from '@src/core/common/file-upload/LocalFileUploadService';
export declare class UsersController {
    private getUserUseCase;
    private createUserUseCase;
    private getUserListWithFilter;
    private updateUserUseCase;
    private updateProfileUseCase;
    private deleteUserUseCase;
    private prisma;
    private localFileUploadService;
    constructor(getUserUseCase: GetUserUseCase, createUserUseCase: CreateUserUseCase, getUserListWithFilter: GetUserListWithFilterUseCase, updateUserUseCase: UpdateUserUseCase, updateProfileUseCase: UpdateProfileUseCase, deleteUserUseCase: DeleteUserUseCase, prisma: PrismaService, localFileUploadService: LocalFileUploadService);
    findOne(req: any): Promise<CoreApiResonseSchema<any>>;
    findOneById(req: any, params: {
        id: string;
    }): Promise<CoreApiResonseSchema<any>>;
    getAllByFilter(params: UserFilterSchama, req: any): Promise<CoreApiResonseSchema<{
        users: import("../../core/domain/user/entity/User").UserEntity[];
        totalCounts: number;
    }>>;
    updateUser(user: UpdateUserRequestSchema, params: {
        id: string;
    }, req: any): Promise<CoreApiResonseSchema<any>>;
    updateProfile(profileData: UpdateProfileRequestSchema, req: any): Promise<CoreApiResonseSchema<any>>;
    deleteUser(id: string, req: any): Promise<CoreApiResonseSchema<any>>;
    uploadProfileImage(file: any, req: any): Promise<CoreApiResonseSchema<any>>;
}
