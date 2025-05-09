import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { SUPPLIER_DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class GetSupplierDebtUseCase {
  constructor(
    @Inject(SUPPLIER_DEBT_REPOSITORY)
    private supplierDebtRepository: ISupplierDebtRepository,
  ) {}

  async execute(id: number): Promise<SupplierDebt> {
    const debt = await this.supplierDebtRepository.findById(id);

    if (!debt) {
      throw new NotFoundException(`Supplier debt with ID ${id} not found`);
    }

    return debt;
  }

  async findByTransactionId(transactionId: number): Promise<SupplierDebt> {
    const debt =
      await this.supplierDebtRepository.findByTransactionId(transactionId);

    if (!debt) {
      throw new NotFoundException(
        `Supplier debt with transaction ID ${transactionId} not found`,
      );
    }

    return debt;
  }

  async findBySupplierId(supplierId: number): Promise<SupplierDebt[]> {
    return this.supplierDebtRepository.findBySupplierId(supplierId);
  }
}
