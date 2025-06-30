import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TRANSACTION_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';

@Injectable()
export class GetTransactionUseCase {
  private readonly logger = new Logger(GetTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: number): Promise<Transaction> {
    this.logger.log(`Fetching transaction with ID: ${id}`);

    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      this.logger.warn(`Transaction with ID ${id} not found`);
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async findByCustomerId(customerId: number): Promise<Transaction[]> {
    this.logger.log(`Fetching transactions for customer ID: ${customerId}`);
    return this.transactionRepository.findByCustomerId(customerId);
  }

  async findBySupplierId(supplierId: number): Promise<Transaction[]> {
    this.logger.log(`Fetching transactions for supplier ID: ${supplierId}`);
    return this.transactionRepository.findBySupplierId(supplierId);
  }
}
