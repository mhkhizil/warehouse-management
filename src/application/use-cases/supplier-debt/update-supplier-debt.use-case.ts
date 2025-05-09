import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupplierDebt } from '@prisma/client';
import { ISupplierDebtRepository } from '../../../domain/interfaces/repositories/supplier-debt.repository.interface';
import { SUPPLIER_DEBT_REPOSITORY } from '../../../domain/constants/repository.tokens';
import { UpdateSupplierDebtDto } from '../../dtos/supplier-debt/update-supplier-debt.dto';

@Injectable()
export class UpdateSupplierDebtUseCase {
  constructor(
    @Inject(SUPPLIER_DEBT_REPOSITORY)
    private supplierDebtRepository: ISupplierDebtRepository,
  ) {}

  async execute(
    id: number,
    data: UpdateSupplierDebtDto,
  ): Promise<SupplierDebt> {
    // Check if debt exists
    const existingDebt = await this.supplierDebtRepository.findById(id);
    if (!existingDebt) {
      throw new NotFoundException(`Supplier debt with ID ${id} not found`);
    }

    // Validate amount if provided
    if (data.amount !== undefined && data.amount <= 0) {
      throw new BadRequestException('Debt amount must be greater than zero');
    }

    // Prepare data for update
    const updateData: Partial<SupplierDebt> = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };

    return this.supplierDebtRepository.update(id, updateData);
  }
}
