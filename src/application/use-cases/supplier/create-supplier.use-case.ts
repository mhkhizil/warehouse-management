import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Supplier } from '@prisma/client';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { CreateSupplierDto } from '../../dtos/supplier/create-supplier.dto';

@Injectable()
export class CreateSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(data: CreateSupplierDto): Promise<Supplier> {
    // Check if supplier with same email already exists
    if (data.email) {
      const existingSupplierByEmail = await this.supplierRepository.findByEmail(
        data.email,
      );
      if (existingSupplierByEmail) {
        throw new BadRequestException(
          'A supplier with this email already exists',
        );
      }
    }

    // Check if supplier with same phone already exists
    if (data.phone) {
      const existingSupplierByPhone = await this.supplierRepository.findByPhone(
        data.phone,
      );
      if (existingSupplierByPhone) {
        throw new BadRequestException(
          'A supplier with this phone already exists',
        );
      }
    }

    return this.supplierRepository.create(data);
  }
}
