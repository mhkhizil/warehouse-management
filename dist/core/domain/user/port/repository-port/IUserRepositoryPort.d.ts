import { IBaseRepository } from 'src/core/common/base-repository/port';
import { UserEntity } from '../../entity/User';
import { UserFilter } from '../../dto/UserFilter';
export declare abstract class IUserRepository implements IBaseRepository<UserEntity, {
    id?: string;
    email?: string;
    name?: string;
}> {
    create: (entity: UserEntity) => Promise<UserEntity>;
    delete: (id: string) => Promise<boolean>;
    find: (by: {
        id?: string;
        email?: string;
        name?: string;
        phone?: string;
    }) => Promise<UserEntity | null>;
    findAll: () => Promise<UserEntity[]>;
    update: (entity: UserEntity) => Promise<UserEntity>;
    findAllWithSchema: (filter: UserFilter) => Promise<{
        users: UserEntity[];
        totalCounts: number;
    }>;
}
