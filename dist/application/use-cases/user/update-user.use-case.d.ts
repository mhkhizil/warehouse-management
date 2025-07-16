import { User } from '@prisma/client';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
import { UpdateUserDto } from '../../dtos/user/update-user.dto';
export declare class UpdateUserUseCase {
    private readonly userRepository;
    private readonly logger;
    constructor(userRepository: IUserRepository);
    execute(id: number, updateUserDto: UpdateUserDto): Promise<User>;
}
