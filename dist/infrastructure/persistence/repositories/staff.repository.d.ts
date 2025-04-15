import { Staff } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IStaffRepository, StaffFilter } from '../../../domain/interfaces/repositories/staff.repository.interface';
export declare class StaffRepository implements IStaffRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Partial<Staff>): Promise<Staff>;
    findById(id: number): Promise<Staff | null>;
    findAll(): Promise<Staff[]>;
    update(id: number, data: Partial<Staff>): Promise<Staff>;
    delete(id: number): Promise<boolean>;
    findByUserId(userId: number): Promise<Staff | null>;
    findWithFilters(filter: StaffFilter): Promise<{
        staff: Staff[];
        total: number;
    }>;
}
