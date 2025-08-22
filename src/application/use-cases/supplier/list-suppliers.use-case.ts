import { Injectable, Inject } from '@nestjs/common';
import { Supplier } from '@prisma/client';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { SupplierFilterDto } from '../../dtos/supplier-filter.dto';
import { SupplierFilter } from '../../../domain/filters/supplier.filter';
  
@Injectable()
export class ListSuppliersUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(
    filter: SupplierFilterDto,
  ): Promise<{ suppliers: Supplier[]; total: number }> {
    const supplierFilter: SupplierFilter = {
      name: filter.name,
      email: filter.email,
      phone: filter.phone,
      address: filter.address,
      contactPerson: filter.contactPerson,
      isActive: filter.isActive,
      take: filter.take,
      skip: filter.skip,
      sortBy: filter.sortBy,
      sortOrder: filter.sortOrder,
    };

    return this.supplierRepository.findWithFilters(supplierFilter);
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.findAll();
  }

  async findDeletedWithFilters(
    filter: SupplierFilter,
  ): Promise<{ suppliers: Supplier[]; total: number }> {
    return this.supplierRepository.findDeletedWithFilters(filter);
  }
}
