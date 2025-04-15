import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Debt } from '@prisma/client';
import { DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { IDebtRepository } from '../../../domain/interfaces/repositories/debt.repository.interface';
import { UpdateDebtDto } from '../../dtos/debt/update-debt.dto';

@Injectable()
export class UpdateDebtUseCase {
  private readonly logger = new Logger(UpdateDebtUseCase.name);

  constructor(
    @Inject(DEBT_REPOSITORY)
    private readonly debtRepository: IDebtRepository,
  ) {}

  async execute(id: number, updateDebtDto: UpdateDebtDto): Promise<Debt> {
    this.logger.log(`Updating debt with ID: ${id}`);

    // Check if debt exists
    const debt = await this.debtRepository.findById(id);
    if (!debt) {
      this.logger.warn(`Debt with ID ${id} not found`);
      throw new NotFoundException(`Debt with ID ${id} not found`);
    }

    // Update debt
    return await this.debtRepository.update(id, updateDebtDto);
  }
}
