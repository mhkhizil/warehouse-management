import { CreateUserDto } from '../user/create-user.dto';
export declare class StaffPermissionsDto {
    canEditItems?: boolean;
    canViewReports?: boolean;
    canManageStock?: boolean;
    canManageCustomers?: boolean;
    canManageTransactions?: boolean;
    canManageDebt?: boolean;
}
export declare class CreateStaffDto {
    fullName: string;
    phone?: string;
    permissions: StaffPermissionsDto;
    userId?: number;
    user?: CreateUserDto;
}
