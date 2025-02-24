import { UserRole } from 'src/core/common/type/UserEnum';
export declare class CreateUserSchema {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
}
