import { CreateSupplierDebtDto } from '../dtos/supplier-debt/create-supplier-debt.dto';
import { UpdateSupplierDebtDto } from '../dtos/supplier-debt/update-supplier-debt.dto';
import { SupplierDebtFilterDto } from '../dtos/supplier-debt-filter.dto';
import { CreateSupplierDebtUseCase } from '../use-cases/supplier-debt/create-supplier-debt.use-case';
import { GetSupplierDebtUseCase } from '../use-cases/supplier-debt/get-supplier-debt.use-case';
import { UpdateSupplierDebtUseCase } from '../use-cases/supplier-debt/update-supplier-debt.use-case';
import { ListSupplierDebtsUseCase } from '../use-cases/supplier-debt/list-supplier-debts.use-case';
import { DeleteSupplierDebtUseCase } from '../use-cases/supplier-debt/delete-supplier-debt.use-case';
import { MarkSupplierDebtSettledUseCase } from '../use-cases/supplier-debt/mark-supplier-debt-settled.use-case';
import { MarkSupplierDebtAlertSentUseCase } from '../use-cases/supplier-debt/mark-supplier-debt-alert-sent.use-case';
import { FindOverdueSupplierDebtsUseCase } from '../use-cases/supplier-debt/find-overdue-supplier-debts.use-case';
import { CoreApiResonseSchema } from '../../core/common/schema/ApiResponseSchema';
export declare class SupplierDebtsController {
    private readonly createSupplierDebtUseCase;
    private readonly getSupplierDebtUseCase;
    private readonly updateSupplierDebtUseCase;
    private readonly listSupplierDebtsUseCase;
    private readonly deleteSupplierDebtUseCase;
    private readonly markSupplierDebtSettledUseCase;
    private readonly markSupplierDebtAlertSentUseCase;
    private readonly findOverdueSupplierDebtsUseCase;
    constructor(createSupplierDebtUseCase: CreateSupplierDebtUseCase, getSupplierDebtUseCase: GetSupplierDebtUseCase, updateSupplierDebtUseCase: UpdateSupplierDebtUseCase, listSupplierDebtsUseCase: ListSupplierDebtsUseCase, deleteSupplierDebtUseCase: DeleteSupplierDebtUseCase, markSupplierDebtSettledUseCase: MarkSupplierDebtSettledUseCase, markSupplierDebtAlertSentUseCase: MarkSupplierDebtAlertSentUseCase, findOverdueSupplierDebtsUseCase: FindOverdueSupplierDebtsUseCase);
    create(createSupplierDebtDto: CreateSupplierDebtDto): Promise<CoreApiResonseSchema<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        transactionId: number | null;
        supplierId: number;
        amount: number;
        dueDate: Date;
        isSettled: boolean;
        alertSent: boolean;
    }>>;
    findAll(filter: SupplierDebtFilterDto): Promise<CoreApiResonseSchema<{
        debts: import(".prisma/client").SupplierDebt[];
        total: number;
    }>>;
    findAllDebts(): Promise<CoreApiResonseSchema<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        transactionId: number | null;
        supplierId: number;
        amount: number;
        dueDate: Date;
        isSettled: boolean;
        alertSent: boolean;
    }[]>>;
    findOverdueDebts(): Promise<CoreApiResonseSchema<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        transactionId: number | null;
        supplierId: number;
        amount: number;
        dueDate: Date;
        isSettled: boolean;
        alertSent: boolean;
    }[]>>;
    findBySupplier(supplierId: number): Promise<CoreApiResonseSchema<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        transactionId: number | null;
        supplierId: number;
        amount: number;
        dueDate: Date;
        isSettled: boolean;
        alertSent: boolean;
    }[]>>;
    findByTransaction(transactionId: number): Promise<CoreApiResonseSchema<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        transactionId: number | null;
        supplierId: number;
        amount: number;
        dueDate: Date;
        isSettled: boolean;
        alertSent: boolean;
    }>>;
    findOne(id: number): Promise<CoreApiResonseSchema<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        transactionId: number | null;
        supplierId: number;
        amount: number;
        dueDate: Date;
        isSettled: boolean;
        alertSent: boolean;
    }>>;
    update(id: number, updateSupplierDebtDto: UpdateSupplierDebtDto): Promise<CoreApiResonseSchema<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        transactionId: number | null;
        supplierId: number;
        amount: number;
        dueDate: Date;
        isSettled: boolean;
        alertSent: boolean;
    }>>;
    settleDebt(id: number): Promise<CoreApiResonseSchema<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        transactionId: number | null;
        supplierId: number;
        amount: number;
        dueDate: Date;
        isSettled: boolean;
        alertSent: boolean;
    }>>;
    markAlertSent(id: number): Promise<CoreApiResonseSchema<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        remarks: string | null;
        transactionId: number | null;
        supplierId: number;
        amount: number;
        dueDate: Date;
        isSettled: boolean;
        alertSent: boolean;
    }>>;
    remove(id: number): Promise<CoreApiResonseSchema<boolean>>;
}
