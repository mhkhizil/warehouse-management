import { Inject, Injectable, Logger } from '@nestjs/common';
import { Debt } from '@prisma/client';
import { DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';

@Injectable()
export class FindOverdueDebtsUseCase {
  private readonly logger = new Logger(FindOverdueDebtsUseCase.name);

  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
  ) {}

  async execute(): Promise<Debt[]> {
    this.logger.log('Finding overdue debts');

    const overdueDebts = await this.debtRepository.findOverdueDebts();
    this.logger.log(`Found ${overdueDebts.length} overdue debts`);

    return overdueDebts;
  }
}
