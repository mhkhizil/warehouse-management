import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Debt } from '@prisma/client';
import { DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';

@Injectable()
export class GetDebtUseCase {
  private readonly logger = new Logger(GetDebtUseCase.name);

  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
  ) {}

  async execute(id: number): Promise<Debt> {
    this.logger.log(`Fetching debt with ID: ${id}`);

    const debt = await this.debtRepository.findById(id);
    if (!debt) {
      this.logger.warn(`Debt with ID ${id} not found`);
      throw new NotFoundException(`Debt with ID ${id} not found`);
    }

    return debt;
  }

  async findByCustomerId(customerId: number): Promise<Debt[]> {
    this.logger.log(`Fetching debts for customer ID: ${customerId}`);
    return this.debtRepository.findByCustomerId(customerId);
  }

  async findByTransactionId(transactionId: number): Promise<Debt> {
    this.logger.log(`Fetching debt for transaction ID: ${transactionId}`);

    const debt = await this.debtRepository.findByTransactionId(transactionId);
    if (!debt) {
      this.logger.warn(`Debt for transaction ID ${transactionId} not found`);
      throw new NotFoundException(
        `Debt for transaction ID ${transactionId} not found`,
      );
    }

    return debt;
  }
}
