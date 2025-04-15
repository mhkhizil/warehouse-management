import { User } from '@prisma/client';
import { IUserRepository, UserFilter } from '../../../domain/interfaces/repositories/user.repository.interface';
export declare class ListUsersUseCase {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: IUserRepository);
    execute(filter: UserFilter): Promise<{
        users: User[];
        total: number;
    }>;
    findAll(): Promise<User[]>;
}
