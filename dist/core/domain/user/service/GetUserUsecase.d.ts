import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { IGetUserUseCase } from '../port/service-port/IGetUserUseCase';
export declare class GetUserUseCase implements IGetUserUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(id?: string): Promise<any>;
}
