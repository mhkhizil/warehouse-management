import { Module } from '@nestjs/common';
import { SuppliersController } from '../controller/suppliers.controller';
import { SupplierDebtsController } from '../controller/supplier-debts.controller';
import { CreateSupplierUseCase } from '../use-cases/supplier/create-supplier.use-case';
import { GetSupplierUseCase } from '../use-cases/supplier/get-supplier.use-case';
import { UpdateSupplierUseCase } from '../use-cases/supplier/update-supplier.use-case';
import { ListSuppliersUseCase } from '../use-cases/supplier/list-suppliers.use-case';
import { DeleteSupplierUseCase } from '../use-cases/supplier/delete-supplier.use-case';
import { CreateSupplierDebtUseCase } from '../use-cases/supplier-debt/create-supplier-debt.use-case';
import { GetSupplierDebtUseCase } from '../use-cases/supplier-debt/get-supplier-debt.use-case';
import { UpdateSupplierDebtUseCase } from '../use-cases/supplier-debt/update-supplier-debt.use-case';
import { ListSupplierDebtsUseCase } from '../use-cases/supplier-debt/list-supplier-debts.use-case';
import { DeleteSupplierDebtUseCase } from '../use-cases/supplier-debt/delete-supplier-debt.use-case';
import { MarkSupplierDebtSettledUseCase } from '../use-cases/supplier-debt/mark-supplier-debt-settled.use-case';
import { MarkSupplierDebtAlertSentUseCase } from '../use-cases/supplier-debt/mark-supplier-debt-alert-sent.use-case';
import { FindOverdueSupplierDebtsUseCase } from '../use-cases/supplier-debt/find-overdue-supplier-debts.use-case';
import { RepositoriesModule } from '../../infrastructure/persistence/repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [SuppliersController, SupplierDebtsController],
  providers: [
    CreateSupplierUseCase,
    GetSupplierUseCase,
    UpdateSupplierUseCase,
    ListSuppliersUseCase,
    DeleteSupplierUseCase,
    CreateSupplierDebtUseCase,
    GetSupplierDebtUseCase,
    UpdateSupplierDebtUseCase,
    ListSupplierDebtsUseCase,
    DeleteSupplierDebtUseCase,
    MarkSupplierDebtSettledUseCase,
    MarkSupplierDebtAlertSentUseCase,
    FindOverdueSupplierDebtsUseCase,
  ],
  exports: [],
})
export class SuppliersModule {}
