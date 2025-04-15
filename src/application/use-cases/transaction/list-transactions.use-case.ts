import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TRANSACTION_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { TransactionFilter } from '../../../domain/filters/transaction.filter';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';

@Injectable()
export class ListTransactionsUseCase {
  private readonly logger = new Logger(ListTransactionsUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    filter: TransactionFilter,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    this.logger.log(
      `Fetching transactions with filter: ${JSON.stringify(filter)}`,
    );
    return await this.transactionRepository.findWithFilters(filter);
  }

  async findAll(): Promise<Transaction[]> {
    this.logger.log('Fetching all transactions');
    return await this.transactionRepository.findAll();
  }
}
