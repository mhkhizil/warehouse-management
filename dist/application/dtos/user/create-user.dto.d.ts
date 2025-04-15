import { Role } from '@prisma/client';
export declare class CreateUserDto {
    username: string;
    password: string;
    email?: string;
    role?: Role;
    remarks?: string;
}
