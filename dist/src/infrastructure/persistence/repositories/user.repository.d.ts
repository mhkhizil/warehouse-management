import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository, UserFilter } from '../../../domain/interfaces/repositories/user.repository.interface';
export declare class UserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<User>): Promise<User>;
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: number, data: Partial<User>): Promise<User>;
    delete(id: number): Promise<boolean>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findWithFilters(filter: UserFilter): Promise<{
        users: User[];
        total: number;
    }>;
}
