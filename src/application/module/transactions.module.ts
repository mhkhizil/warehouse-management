import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../infrastructure/persistence/repositories/repositories.module';
import { TransactionsController } from '../controller/transactions.controller';
import { CreateTransactionUseCase } from '../use-cases/transaction/create-transaction.use-case';
import { DeleteTransactionUseCase } from '../use-cases/transaction/delete-transaction.use-case';
import { GetTransactionUseCase } from '../use-cases/transaction/get-transaction.use-case';
import { ListTransactionsUseCase } from '../use-cases/transaction/list-transactions.use-case';
import { UpdateTransactionUseCase } from '../use-cases/transaction/update-transaction.use-case';
import { GetTransactionReportUseCase } from '../use-cases/transaction/get-transaction-report.use-case';
import {
  TRANSACTION_REPOSITORY,
  TRANSACTION_ITEM_REPOSITORY,
  ITEM_REPOSITORY,
  STOCK_REPOSITORY,
  CUSTOMER_REPOSITORY,
  DEBT_REPOSITORY,
  SUPPLIER_DEBT_REPOSITORY,
  SUPPLIER_REPOSITORY,
} from '../../domain/constants/repository.tokens';
import { TransactionRepository } from '../../infrastructure/persistence/repositories/transaction.repository';
import { SuppliersModule } from './suppliers.module';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

@Module({
  imports: [RepositoriesModule, SuppliersModule],
  controllers: [TransactionsController],
  providers: [
    {
      provide: CreateTransactionUseCase,
      useFactory: (
        transactionRepo,
        transactionItemRepo,
        itemRepo,
        stockRepo,
        customerRepo,
        debtRepo,
        supplierRepo,
        supplierDebtRepo,
        prisma,
      ) => {
        console.log(
          'Creating CreateTransactionUseCase with supplier repo:',
          !!supplierRepo,
        );
        return new CreateTransactionUseCase(
          transactionRepo,
          transactionItemRepo,
          itemRepo,
          stockRepo,
          customerRepo,
          debtRepo,
          supplierRepo,
          supplierDebtRepo,
          prisma,
        );
      },
      inject: [
        TRANSACTION_REPOSITORY,
        TRANSACTION_ITEM_REPOSITORY,
        ITEM_REPOSITORY,
        STOCK_REPOSITORY,
        CUSTOMER_REPOSITORY,
        DEBT_REPOSITORY,
        SUPPLIER_REPOSITORY,
        SUPPLIER_DEBT_REPOSITORY,
        PrismaService,
      ],
    },
    {
      provide: DeleteTransactionUseCase,
      useFactory: (transactionRepo) => {
        return new DeleteTransactionUseCase(transactionRepo);
      },
      inject: [TRANSACTION_REPOSITORY],
    },
    {
      provide: GetTransactionUseCase,
      useFactory: (transactionRepo) => {
        return new GetTransactionUseCase(transactionRepo);
      },
      inject: [TRANSACTION_REPOSITORY],
    },
    {
      provide: ListTransactionsUseCase,
      useFactory: (transactionRepo) => {
        return new ListTransactionsUseCase(transactionRepo);
      },
      inject: [TRANSACTION_REPOSITORY],
    },
    {
      provide: UpdateTransactionUseCase,
      useFactory: (transactionRepo) => {
        return new UpdateTransactionUseCase(transactionRepo);
      },
      inject: [TRANSACTION_REPOSITORY],
    },
    {
      provide: GetTransactionReportUseCase,
      useFactory: (transactionRepo) => {
        return new GetTransactionReportUseCase(transactionRepo);
      },
      inject: [TRANSACTION_REPOSITORY],
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
  ],
  exports: [
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionUseCase,
    ListTransactionsUseCase,
    UpdateTransactionUseCase,
    GetTransactionReportUseCase,
  ],
})
export class TransactionsModule {}
