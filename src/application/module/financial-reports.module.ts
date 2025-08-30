import { Module } from '@nestjs/common';
import { FinancialReportsController } from '../controller/financial-reports.controller';
import { ComprehensiveFinancialReportUseCase } from '../use-cases/financial/comprehensive-financial-report.use-case';
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FinancialReportsController],
  providers: [ComprehensiveFinancialReportUseCase],
  exports: [ComprehensiveFinancialReportUseCase],
})
export class FinancialReportsModule {}

