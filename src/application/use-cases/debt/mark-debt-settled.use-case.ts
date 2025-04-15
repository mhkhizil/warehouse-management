import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Debt } from '@prisma/client';
import { DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';

@Injectable()
export class MarkDebtSettledUseCase {
  private readonly logger = new Logger(MarkDebtSettledUseCase.name);

  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
  ) {}

  async execute(id: number): Promise<Debt> {
    this.logger.log(`Marking debt with ID: ${id} as settled`);

    // Check if debt exists
    const debt = await this.debtRepository.findById(id);
    if (!debt) {
      this.logger.warn(`Debt with ID ${id} not found`);
      throw new NotFoundException(`Debt with ID ${id} not found`);
    }

    // Check if already settled
    if (debt.isSettled) {
      this.logger.log(`Debt with ID ${id} is already settled`);
      return debt;
    }

    // Mark as settled
    return await this.debtRepository.markAsSettled(id);
  }
}
