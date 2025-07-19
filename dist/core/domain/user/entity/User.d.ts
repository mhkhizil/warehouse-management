import { UserRole } from 'src/core/common/type/UserEnum';
import { User as PrismaUser } from '@prisma/client';
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImageUrl: string;
    role: UserRole;
    password: string;
    createdDate: Date;
    updatedDate: Date;
    constructor(id: string, name: string, email: string, phone: string, role: UserRole, password?: string, profileImageUrl?: string, createdDate?: Date, updatedDate?: Date);
    static toEntity(user: PrismaUser): UserEntity;
}
