import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { SUPPLIER_DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class MarkSupplierDebtAlertSentUseCase {
  constructor(
    @Inject(SUPPLIER_DEBT_REPOSITORY)
    private supplierDebtRepository: ISupplierDebtRepository,
  ) {}

  async execute(id: number): Promise<SupplierDebt> {
    // Check if debt exists
    const debt = await this.supplierDebtRepository.findById(id);
    if (!debt) {
      throw new NotFoundException(`Supplier debt with ID ${id} not found`);
    }

    // Mark alert as sent
    return this.supplierDebtRepository.update(id, { alertSent: true });
  }
}
