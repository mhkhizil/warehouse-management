import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Supplier } from '@prisma/client';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import { SUPPLIER_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { UpdateSupplierDto } from '../../dtos/supplier/update-supplier.dto';

@Injectable()
export class UpdateSupplierUseCase {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(id: number, data: UpdateSupplierDto): Promise<Supplier> {
    // Check if supplier exists
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    // Check if email is being updated and is not already taken
    if (data.email && data.email !== existingSupplier.email) {
      const supplierWithEmail = await this.supplierRepository.findByEmail(
        data.email,
      );
      if (supplierWithEmail && supplierWithEmail.id !== id) {
        throw new BadRequestException(
          'A supplier with this email already exists',
        );
      }
    }

    // Check if phone is being updated and is not already taken
    if (data.phone && data.phone !== existingSupplier.phone) {
      const supplierWithPhone = await this.supplierRepository.findByPhone(
        data.phone,
      );
      if (supplierWithPhone && supplierWithPhone.id !== id) {
        throw new BadRequestException(
          'A supplier with this phone already exists',
        );
      }
    }

    return this.supplierRepository.update(id, data);
  }
}
