import { CreateStaffDto } from './create-staff.dto';
declare const UpdateStaffDto_base: import("@nestjs/common").Type<Partial<Omit<CreateStaffDto, "user" | "userId">>>;
export declare class UpdateStaffDto extends UpdateStaffDto_base {
}
export {};
