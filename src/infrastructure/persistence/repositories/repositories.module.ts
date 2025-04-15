import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './user.repository';
import { StaffRepository } from './staff.repository';
import { ItemRepository } from './item.repository';
import { StockRepository } from './stock.repository';
import { CustomerRepository } from './customer.repository';
import { TransactionRepository } from './transaction.repository';
import { DebtRepository } from './debt.repository';
import {
  USER_REPOSITORY,
  STAFF_REPOSITORY,
  ITEM_REPOSITORY,
  STOCK_REPOSITORY,
  CUSTOMER_REPOSITORY,
  TRANSACTION_REPOSITORY,
  DEBT_REPOSITORY,
} from '../../../domain/constants/repository.tokens';

const repositories = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: STAFF_REPOSITORY, useClass: StaffRepository },
  { provide: ITEM_REPOSITORY, useClass: ItemRepository },
  { provide: STOCK_REPOSITORY, useClass: StockRepository },
  { provide: CUSTOMER_REPOSITORY, useClass: CustomerRepository },
  { provide: TRANSACTION_REPOSITORY, useClass: TransactionRepository },
  { provide: DEBT_REPOSITORY, useClass: DebtRepository },
];

@Module({
  imports: [PrismaModule],
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoriesModule {}
