import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
export declare class DeleteUserUseCase {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: IUserRepository);
    execute(id: number): Promise<boolean>;
}
