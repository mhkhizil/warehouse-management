import { UserFilter } from '../dto/UserFilter';
import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { IGetUserListUseCase } from '../port/service-port/IGetUserListUseCase';
import { UserEntity } from '../entity/User';
export declare class GetUserListWithFilterUseCase implements IGetUserListUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(filter: UserFilter): Promise<{
        users: UserEntity[];
        totalCounts: number;
    }>;
}
