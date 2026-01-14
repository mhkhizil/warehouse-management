import { Injectable, Inject } from '@nestjs/common';
import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { SupplierDebtFilter } from '../../../domain/filters/supplier-debt.filter';
import { SUPPLIER_DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { SupplierDebtFilterDto } from '../../dtos/supplier-debt-filter.dto';

@Injectable()
export class ListSupplierDebtsUseCase {
  constructor(
    @Inject(SUPPLIER_DEBT_REPOSITORY)
    private supplierDebtRepository: ISupplierDebtRepository,
  ) {}

  async execute(
    filter: SupplierDebtFilterDto,
  ): Promise<{ debts: SupplierDebt[]; total: number }> {
    const supplierDebtFilter: SupplierDebtFilter = {
      supplierId: filter.supplierId,
      supplierName: filter.supplierName,
      isSettled: filter.isSettled,
      dueBefore: filter.dueBefore ? new Date(filter.dueBefore) : undefined,
      dueAfter: filter.dueAfter ? new Date(filter.dueAfter) : undefined,
      createdAtFrom: filter.createdAtFrom ? new Date(filter.createdAtFrom) : undefined,
      createdAtTo: filter.createdAtTo ? new Date(filter.createdAtTo) : undefined,
      updatedAtFrom: filter.updatedAtFrom ? new Date(filter.updatedAtFrom) : undefined,
      updatedAtTo: filter.updatedAtTo ? new Date(filter.updatedAtTo) : undefined,
      sortBy: filter.sortBy,
      sortOrder: filter.sortOrder,
      take: filter.take,
      skip: filter.skip,
    };

    return this.supplierDebtRepository.findWithFilters(supplierDebtFilter);
  }

  async findAll(): Promise<SupplierDebt[]> {
    return this.supplierDebtRepository.findAll();
  }
}
