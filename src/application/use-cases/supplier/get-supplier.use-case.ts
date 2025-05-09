import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Supplier } from '@prisma/client';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class GetSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async findByEmail(email: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findByEmail(email);

    if (!supplier) {
      throw new NotFoundException(`Supplier with email ${email} not found`);
    }

    return supplier;
  }

  async findByPhone(phone: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findByPhone(phone);

    if (!supplier) {
      throw new NotFoundException(`Supplier with phone ${phone} not found`);
    }

    return supplier;
  }

  async findWithDebts(): Promise<Supplier[]> {
    return this.supplierRepository.findWithDebts();
  }
}
