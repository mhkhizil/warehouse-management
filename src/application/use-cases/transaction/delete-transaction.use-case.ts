import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';

@Injectable()
export class DeleteTransactionUseCase {
  private readonly logger = new Logger(DeleteTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    this.logger.log(`Deleting transaction with ID: ${id}`);

    // Check if transaction exists
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      this.logger.warn(`Transaction with ID ${id} not found`);
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Delete transaction
    return await this.transactionRepository.delete(id);
  }
}
