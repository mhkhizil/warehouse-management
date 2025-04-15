import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TRANSACTION_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';

@Injectable()
export class GetTransactionReportUseCase {
  private readonly logger = new Logger(GetTransactionReportUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async getSalesReport(
    startDate: Date,
    endDate: Date,
  ): Promise<{ totalSales: number; transactions: Transaction[] }> {
    this.logger.log(
      `Generating sales report from ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );
    return await this.transactionRepository.getSalesReport(startDate, endDate);
  }

  async getPurchaseReport(
    startDate: Date,
    endDate: Date,
  ): Promise<{ totalPurchases: number; transactions: Transaction[] }> {
    this.logger.log(
      `Generating purchase report from ${startDate.toISOString()} to ${endDate.toISOString()}`,
    );
    return await this.transactionRepository.getPurchaseReport(
      startDate,
      endDate,
    );
  }
}
