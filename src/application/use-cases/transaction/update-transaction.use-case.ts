import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { TRANSACTION_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { ITransactionRepository } from '../../../domain/interfaces/repositories/transaction.repository.interface';
import { UpdateTransactionDto } from '../../dtos/transaction/update-transaction.dto';

@Injectable()
export class UpdateTransactionUseCase {
  private readonly logger = new Logger(UpdateTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    this.logger.log(`Updating transaction with ID: ${id}`);

    // Check if transaction exists
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      this.logger.warn(`Transaction with ID ${id} not found`);
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    // Update transaction
    return await this.transactionRepository.update(id, updateTransactionDto);
  }
}
