import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { ISupplierRepository } from '../../../domain/interfaces/repositories/supplier.repository.interface';
import {
  SUPPLIER_DEBT_REPOSITORY,
  SUPPLIER_REPOSITORY,
} from '../../../domain/constants/repository.tokens';
import { CreateSupplierDebtDto } from '../../dtos/supplier-debt/create-supplier-debt.dto';

@Injectable()
export class CreateSupplierDebtUseCase {
  constructor(
    @Inject(SUPPLIER_DEBT_REPOSITORY)
    private supplierDebtRepository: ISupplierDebtRepository,
    @Inject(SUPPLIER_REPOSITORY)
    private supplierRepository: ISupplierRepository,
  ) {}

  async execute(data: CreateSupplierDebtDto): Promise<SupplierDebt> {
    // Check if supplier exists
    const supplier = await this.supplierRepository.findById(data.supplierId);
    if (!supplier) {
      throw new NotFoundException(
        `Supplier with ID ${data.supplierId} not found`,
      );
    }

    // Validate amount is positive
    if (data.amount <= 0) {
      throw new BadRequestException('Debt amount must be greater than zero');
    }

    // Create the debt record
    return this.supplierDebtRepository.create({
      supplierId: data.supplierId,
      amount: data.amount,
      dueDate: new Date(data.dueDate),
      isSettled: data.isSettled || false,
      transactionId: data.transactionId,
      remarks: data.remarks,
    });
  }
}
