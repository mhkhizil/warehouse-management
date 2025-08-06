import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './application/module/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './application/module/auth.module';
import { PrismaModule } from './application/module/prisma.module';
import { ItemsModule } from './application/module/items.module';
import { StocksModule } from './application/module/stocks.module';
import { CustomersModule } from './application/module/customers.module';
import { TransactionsModule } from './application/module/transactions.module';
import { DebtsModule } from './application/module/debts.module';
import { SuppliersModule } from './application/module/suppliers.module';
import { CsrfModule } from './core/common/module/csrf.module';
import { CsrfMiddleware } from './core/common/middleware/csrf.middleware';
import { CsrfGuard } from './core/common/guard/csrf.guard';
import { DebtAlertModule } from './core/common/pusher/DebtAlertModule';

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
    SuppliersModule,
    CsrfModule,
    DebtAlertModule,
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
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfMiddleware).forRoutes('*');
  }
}
