import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { SUPPLIER_DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class MarkSupplierDebtSettledUseCase {
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

    // If debt is already settled, just return it
    if (debt.isSettled) {
      return debt;
    }

    // Mark debt as settled
    return this.supplierDebtRepository.updateSettlementStatus(id, true);
  }
}
