import { Inject, Injectable, Logger } from '@nestjs/common';
import { Debt } from '@prisma/client';
import { DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { DebtFilter } from '../../../domain/filters/debt.filter';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';

@Injectable()
export class ListDebtsUseCase {
  private readonly logger = new Logger(ListDebtsUseCase.name);

  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
  ) {}

  async execute(filter: DebtFilter): Promise<{ debts: Debt[]; total: number }> {
    this.logger.log(`Fetching debts with filter: ${JSON.stringify(filter)}`);
    return await this.debtRepository.findWithFilters(filter);
  }

  async findAll(): Promise<Debt[]> {
    this.logger.log('Fetching all debts');
    return await this.debtRepository.findAll();
  }

  async findOverdueDebts(): Promise<Debt[]> {
    this.logger.log('Fetching overdue debts');
    return await this.debtRepository.findOverdueDebts();
  }
}
