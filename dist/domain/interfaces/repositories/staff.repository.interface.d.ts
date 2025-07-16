import { Staff } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
export type StaffFilter = {
    fullName?: string;
    phone?: string;
    skip?: number;
    take?: number;
};
export interface IStaffRepository extends IBaseRepository<Staff, number> {
    findByUserId(userId: number): Promise<Staff | null>;
    findWithFilters(filter: StaffFilter): Promise<{
        staff: Staff[];
        total: number;
    }>;
}
