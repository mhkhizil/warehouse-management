import { CreateSupplierDto } from '../dtos/supplier/create-supplier.dto';
import { UpdateSupplierDto } from '../dtos/supplier/update-supplier.dto';
import { SupplierFilterDto } from '../dtos/supplier-filter.dto';
import { CreateSupplierUseCase } from '../use-cases/supplier/create-supplier.use-case';
import { GetSupplierUseCase } from '../use-cases/supplier/get-supplier.use-case';
import { UpdateSupplierUseCase } from '../use-cases/supplier/update-supplier.use-case';
import { ListSuppliersUseCase } from '../use-cases/supplier/list-suppliers.use-case';
import { DeleteSupplierUseCase } from '../use-cases/supplier/delete-supplier.use-case';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';
export declare class SuppliersController {
    private readonly createSupplierUseCase;
    private readonly getSupplierUseCase;
    private readonly updateSupplierUseCase;
    private readonly listSuppliersUseCase;
    private readonly deleteSupplierUseCase;
    constructor(createSupplierUseCase: CreateSupplierUseCase, getSupplierUseCase: GetSupplierUseCase, updateSupplierUseCase: UpdateSupplierUseCase, listSuppliersUseCase: ListSuppliersUseCase, deleteSupplierUseCase: DeleteSupplierUseCase);
    create(createSupplierDto: CreateSupplierDto): Promise<CoreApiResonseSchema<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        address: string | null;
        isActive: boolean;
        contactPerson: string | null;
    }>>;
    findAll(filter: SupplierFilterDto): Promise<CoreApiResonseSchema<{
        suppliers: import(".prisma/client").Supplier[];
        total: number;
    }>>;
    findAllSuppliers(): Promise<CoreApiResonseSchema<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        address: string | null;
        isActive: boolean;
        contactPerson: string | null;
    }[]>>;
    findWithDebts(): Promise<CoreApiResonseSchema<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        address: string | null;
        isActive: boolean;
        contactPerson: string | null;
    }[]>>;
    findByEmail(email: string): Promise<CoreApiResonseSchema<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        address: string | null;
        isActive: boolean;
        contactPerson: string | null;
    }>>;
    findByPhone(phone: string): Promise<CoreApiResonseSchema<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        address: string | null;
        isActive: boolean;
        contactPerson: string | null;
    }>>;
    findOne(id: number): Promise<CoreApiResonseSchema<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        address: string | null;
        isActive: boolean;
        contactPerson: string | null;
    }>>;
    update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<CoreApiResonseSchema<{
        name: string;
        id: number;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        address: string | null;
        isActive: boolean;
        contactPerson: string | null;
    }>>;
    remove(id: number): Promise<CoreApiResonseSchema<boolean>>;
}
