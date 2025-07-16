import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { UserEntity } from '../entity/User';
import { UpdateProfileDto } from '../dto/UpdateProfileDto';
import { PrismaService } from '@src/core/common/prisma/PrismaService';
import { IUpdateProfileUseCase } from '../port/service-port/IUpdateProfileUseCase';
export declare class UpdateProfileUseCase implements IUpdateProfileUseCase {
    private readonly userRepository;
    private readonly prisma;
    constructor(userRepository: IUserRepository, prisma: PrismaService);
    execute(userId: string, data: UpdateProfileDto): Promise<UserEntity>;
}
