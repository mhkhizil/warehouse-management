import { UserRole } from 'src/core/common/type/UserEnum';
export declare class UpdateUserRequestSchema {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
}
