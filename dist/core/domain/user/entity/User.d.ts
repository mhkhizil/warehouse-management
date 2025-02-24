import { UserRole } from 'src/core/common/type/UserEnum';
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
    createdDate: Date;
    updatedDate: Date;
    constructor(id: string, name: string, email: string, phone: string, role: UserRole, password?: string, createdDate?: Date, updatedDate?: Date);
    static toEntity(user: any): UserEntity;
}
