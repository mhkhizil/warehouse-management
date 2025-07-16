import { User } from '@prisma/client';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
export declare class GetUserUseCase {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: IUserRepository);
    execute(id: number): Promise<User>;
    getByUsername(username: string): Promise<User>;
}
