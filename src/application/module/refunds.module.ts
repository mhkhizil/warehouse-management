import { Module } from '@nestjs/common';
import {
  RefundsController,
  TransactionRefundsController,
} from '../controller/refunds.controller';
import { CreateRefundUseCase } from '../use-cases/refund/create-refund.use-case';
import { ProcessRefundUseCase } from '../use-cases/refund/process-refund.use-case';
import { GetRefundUseCase } from '../use-cases/refund/get-refund.use-case';
import { ListRefundsUseCase } from '../use-cases/refund/list-refunds.use-case';
import { ValidateRefundEligibilityUseCase } from '../use-cases/refund/validate-refund-eligibility.use-case';
import { RefundRepository } from '../../infrastructure/persistence/repositories/refund.repository';
import { IRefundRepository } from '../../domain/interfaces/repositories/refund.repository.interface';
import { REFUND_REPOSITORY } from '../../domain/constants/repository.tokens';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { FinancialPrecisionService } from '../../core/common/service/financial-precision.service';
import { WarrantyValidationService } from '../../core/common/service/warranty-validation.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AdminGuard } from '../auth/guard/admin.guard';

@Module({
  controllers: [RefundsController, TransactionRefundsController],
  providers: [
    // Use Cases
    CreateRefundUseCase,
    ProcessRefundUseCase,
    GetRefundUseCase,
    ListRefundsUseCase,
    ValidateRefundEligibilityUseCase,

    // Repository
    {
      provide: REFUND_REPOSITORY,
      useClass: RefundRepository,
    },

    // Services
    PrismaService,
    FinancialPrecisionService,
    WarrantyValidationService,

    // Guards
    JwtGuard,
    AdminGuard,
  ],
  exports: [
    CreateRefundUseCase,
    ProcessRefundUseCase,
    GetRefundUseCase,
    ListRefundsUseCase,
    ValidateRefundEligibilityUseCase,
    REFUND_REPOSITORY,
  ],
})
export class RefundsModule {}
