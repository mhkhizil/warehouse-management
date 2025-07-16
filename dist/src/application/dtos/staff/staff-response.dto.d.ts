import { Staff, User } from '@prisma/client';
import { UserResponseDto } from '../user/user-response.dto';
export declare class StaffResponseDto implements Partial<Staff> {
    id: number;
    userId: number;
    user?: UserResponseDto;
    fullName: string;
    phone: string | null;
    permissions: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<Staff> & {
        user?: Partial<User>;
    });
}
