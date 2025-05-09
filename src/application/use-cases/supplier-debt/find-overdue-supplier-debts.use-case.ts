import { Injectable, Inject } from '@nestjs/common';
import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { SUPPLIER_DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class FindOverdueSupplierDebtsUseCase {
  constructor(
    @Inject(SUPPLIER_DEBT_REPOSITORY)
    private supplierDebtRepository: ISupplierDebtRepository,
  ) {}

  async execute(): Promise<SupplierDebt[]> {
    // Get unsettled debts
    const unsettledDebts = await this.supplierDebtRepository.findUnsettled();

    // Filter for debts that are overdue (due date is in the past)
    const now = new Date();
    return unsettledDebts.filter((debt) => debt.dueDate < now);
  }
}
