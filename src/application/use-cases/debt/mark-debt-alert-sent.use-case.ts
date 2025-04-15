import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Debt } from '@prisma/client';
import { DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';

@Injectable()
export class MarkDebtAlertSentUseCase {
  private readonly logger = new Logger(MarkDebtAlertSentUseCase.name);

  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
  ) {}

  async execute(id: number): Promise<Debt> {
    this.logger.log(`Marking debt with ID: ${id} alert as sent`);

    // Check if debt exists
    const debt = await this.debtRepository.findById(id);
    if (!debt) {
      this.logger.warn(`Debt with ID ${id} not found`);
      throw new NotFoundException(`Debt with ID ${id} not found`);
    }

    // Check if alert already sent
    if (debt.alertSent) {
      this.logger.log(`Alert for debt with ID ${id} is already marked as sent`);
      return debt;
    }

    // Mark alert as sent
    return await this.debtRepository.markAlertSent(id);
  }
}
