import { Role, User } from '@prisma/client';
export declare class UserResponseDto implements Partial<User> {
    id: number;
    username: string;
    email: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    remarks: string | null;
    password: string;
    constructor(partial: Partial<User>);
}
