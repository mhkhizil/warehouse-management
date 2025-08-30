import { Injectable, Logger, Inject } from '@nestjs/common';
import { Refund } from '@prisma/client';
import { IRefundRepository } from '../../../domain/interfaces/repositories/refund.repository.interface';
import { REFUND_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class ListRefundsUseCase {
  private readonly logger = new Logger(ListRefundsUseCase.name);

  constructor(
    @Inject(REFUND_REPOSITORY)
    private readonly refundRepository: IRefundRepository,
  ) {}

  async execute(): Promise<Refund[]> {
    this.logger.log('Listing all refunds');
    return this.refundRepository.findAll();
  }

  async getByTransactionId(transactionId: number): Promise<Refund[]> {
    this.logger.log(`Getting refunds for transaction ID: ${transactionId}`);
    return this.refundRepository.findByTransactionId(transactionId);
  }

  async getByCustomerId(customerId: number): Promise<Refund[]> {
    this.logger.log(`Getting refunds for customer ID: ${customerId}`);
    return this.refundRepository.findByCustomerId(customerId);
  }
}
