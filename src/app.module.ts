import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './application/module/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './application/module/auth.module';
import { PrismaModule } from './application/module/prisma.module';
import { ItemsModule } from './application/module/items.module';
import { StocksModule } from './application/module/stocks.module';
import { CustomersModule } from './application/module/customers.module';
import { TransactionsModule } from './application/module/transactions.module';
import { DebtsModule } from './application/module/debts.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    ItemsModule,
    StocksModule,
    CustomersModule,
    TransactionsModule,
    DebtsModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
