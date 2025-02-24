import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { ICreateUserUseCase } from '../port/service-port/ICreateUserUseCase';
import { CreateUserDto } from '../dto/CreateUserDto';
export declare class CreateUserUseCase implements ICreateUserUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(data?: CreateUserDto): Promise<any>;
}
