import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { SUPPLIER_DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class DeleteSupplierDebtUseCase {
  constructor(
    @Inject(SUPPLIER_DEBT_REPOSITORY)
    private supplierDebtRepository: ISupplierDebtRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    const debt = await this.supplierDebtRepository.findById(id);

    if (!debt) {
      throw new NotFoundException(`Supplier debt with ID ${id} not found`);
    }

    return this.supplierDebtRepository.delete(id);
  }
}
