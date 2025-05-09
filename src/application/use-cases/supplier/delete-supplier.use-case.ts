import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class DeleteSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return this.supplierRepository.delete(id);
  }
}
