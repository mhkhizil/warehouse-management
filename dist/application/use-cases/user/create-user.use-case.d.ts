import { User } from '@prisma/client';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
export declare class CreateUserUseCase {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: IUserRepository);
    execute(createUserDto: CreateUserDto): Promise<User>;
}
