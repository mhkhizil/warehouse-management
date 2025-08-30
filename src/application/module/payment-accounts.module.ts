import { Module } from '@nestjs/common';
import { PaymentAccountsController } from '../controller/payment-accounts.controller';
import { CreatePaymentAccountUseCase } from '../use-cases/payment-account/create-payment-account.use-case';
import { GetPaymentAccountUseCase } from '../use-cases/payment-account/get-payment-account.use-case';
import { ListPaymentAccountsUseCase } from '../use-cases/payment-account/list-payment-accounts.use-case';
import { UpdatePaymentAccountUseCase } from '../use-cases/payment-account/update-payment-account.use-case';
import { DeletePaymentAccountUseCase } from '../use-cases/payment-account/delete-payment-account.use-case';
import { PaymentAccountRepository } from '../../infrastructure/persistence/repositories/payment-account.repository';
import { PAYMENT_ACCOUNT_REPOSITORY } from '../../domain/constants/repository.tokens';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';

@Module({
  controllers: [PaymentAccountsController],
  providers: [
    // Use Cases
    CreatePaymentAccountUseCase,
    GetPaymentAccountUseCase,
    ListPaymentAccountsUseCase,
    UpdatePaymentAccountUseCase,
    DeletePaymentAccountUseCase,

    // Repository
    {
      provide: PAYMENT_ACCOUNT_REPOSITORY,
      useClass: PaymentAccountRepository,
    },

    // Services
    PrismaService,

    // Guards
    JwtGuard,
    AdminGuard,
  ],
  exports: [
    CreatePaymentAccountUseCase,
    GetPaymentAccountUseCase,
    ListPaymentAccountsUseCase,
    UpdatePaymentAccountUseCase,
    DeletePaymentAccountUseCase,
    PAYMENT_ACCOUNT_REPOSITORY,
  ],
})
export class PaymentAccountsModule {}
