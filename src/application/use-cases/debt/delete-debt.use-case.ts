import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';

@Injectable()
export class DeleteDebtUseCase {
  private readonly logger = new Logger(DeleteDebtUseCase.name);

  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    this.logger.log(`Deleting debt with ID: ${id}`);

    // Check if debt exists
    const debt = await this.debtRepository.findById(id);
    if (!debt) {
      this.logger.warn(`Debt with ID ${id} not found`);
      throw new NotFoundException(`Debt with ID ${id} not found`);
    }

    // Delete debt
    return await this.debtRepository.delete(id);
  }
}
