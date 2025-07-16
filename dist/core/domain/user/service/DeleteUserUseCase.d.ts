import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { PrismaService } from '@src/core/common/prisma/PrismaService';
import { IDeleteUserUseCase } from '../port/service-port/IDeleteUserUseCase';
export declare class DeleteUserUseCase implements IDeleteUserUseCase {
    private readonly userRepository;
    private readonly prisma;
    constructor(userRepository: IUserRepository, prisma: PrismaService);
    execute(adminUserId: string, userIdToDelete: string): Promise<boolean>;
}
