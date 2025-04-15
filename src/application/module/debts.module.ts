import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure/persistence/repositories/repositories.module';
import { DebtsController } from '../controller/debts.controller';
import { CreateDebtUseCase } from '../use-cases/debt/create-debt.use-case';
import { DeleteDebtUseCase } from '../use-cases/debt/delete-debt.use-case';
import { GetDebtUseCase } from '../use-cases/debt/get-debt.use-case';
import { ListDebtsUseCase } from '../use-cases/debt/list-debts.use-case';
import { UpdateDebtUseCase } from '../use-cases/debt/update-debt.use-case';
import { MarkDebtSettledUseCase } from '../use-cases/debt/mark-debt-settled.use-case';
import { MarkDebtAlertSentUseCase } from '../use-cases/debt/mark-debt-alert-sent.use-case';
import { FindOverdueDebtsUseCase } from '../use-cases/debt/find-overdue-debts.use-case';
import {
  DEBT_REPOSITORY,
  CUSTOMER_REPOSITORY,
  TRANSACTION_REPOSITORY,
} from '../../domain/constants/repository.tokens';
import { DebtRepository } from '../../infrastructure/persistence/repositories/debt.repository';

@Module({
  imports: [RepositoriesModule],
  controllers: [DebtsController],
  providers: [
    {
      provide: CreateDebtUseCase,
      useFactory: (debtRepo, customerRepo, transactionRepo) => {
        return new CreateDebtUseCase(debtRepo, customerRepo, transactionRepo);
      },
      inject: [DEBT_REPOSITORY, CUSTOMER_REPOSITORY, TRANSACTION_REPOSITORY],
    },
    {
      provide: DeleteDebtUseCase,
      useFactory: (debtRepo) => {
        return new DeleteDebtUseCase(debtRepo);
      },
      inject: [DEBT_REPOSITORY],
    },
    {
      provide: GetDebtUseCase,
      useFactory: (debtRepo) => {
        return new GetDebtUseCase(debtRepo);
      },
      inject: [DEBT_REPOSITORY],
    },
    {
      provide: ListDebtsUseCase,
      useFactory: (debtRepo) => {
        return new ListDebtsUseCase(debtRepo);
      },
      inject: [DEBT_REPOSITORY],
    },
    {
      provide: UpdateDebtUseCase,
      useFactory: (debtRepo) => {
        return new UpdateDebtUseCase(debtRepo);
      },
      inject: [DEBT_REPOSITORY],
    },
    {
      provide: MarkDebtSettledUseCase,
      useFactory: (debtRepo) => {
        return new MarkDebtSettledUseCase(debtRepo);
      },
      inject: [DEBT_REPOSITORY],
    },
    {
      provide: MarkDebtAlertSentUseCase,
      useFactory: (debtRepo) => {
        return new MarkDebtAlertSentUseCase(debtRepo);
      },
      inject: [DEBT_REPOSITORY],
    },
    {
      provide: FindOverdueDebtsUseCase,
      useFactory: (debtRepo) => {
        return new FindOverdueDebtsUseCase(debtRepo);
      },
      inject: [DEBT_REPOSITORY],
    },
    {
      provide: DEBT_REPOSITORY,
      useClass: DebtRepository,
    },
  ],
  exports: [
    CreateDebtUseCase,
    DeleteDebtUseCase,
    GetDebtUseCase,
    ListDebtsUseCase,
    UpdateDebtUseCase,
    MarkDebtSettledUseCase,
    MarkDebtAlertSentUseCase,
    FindOverdueDebtsUseCase,
  ],
})
export class DebtsModule {}
