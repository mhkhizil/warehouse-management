import { ApiProperty } from '@nestjs/swagger';
import { SupplierDebt, Supplier } from '@prisma/client';
import { Type } from 'class-transformer';
import { SupplierResponseDto } from '../supplier/supplier-response.dto';

// Define interface with relations
interface SupplierDebtWithRelations extends SupplierDebt {
  supplier?: Supplier;
}

export class SupplierDebtResponseDto implements Partial<SupplierDebt> {
  @ApiProperty({ description: 'Supplier Debt ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Supplier ID', example: 1 })
  supplierId: number;

  @ApiProperty({
    description: 'Supplier information',
    type: SupplierResponseDto,
    required: false,
  })
  @Type(() => SupplierResponseDto)
  supplier?: SupplierResponseDto;

  @ApiProperty({ description: 'Debt amount', example: 1500.0 })
  amount: number;

  @ApiProperty({
    description: 'Due date',
    example: '2023-12-31T00:00:00Z',
  })
  dueDate: Date;

  @ApiProperty({ description: 'Whether the debt is settled', example: false })
  isSettled: boolean;

  @ApiProperty({ description: 'Whether alert has been sent', example: false })
  alertSent: boolean;

  @ApiProperty({ description: 'Transaction ID', example: 123, required: false })
  transactionId: number | null;

  @ApiProperty({
    description: 'Additional remarks',
    example: 'Payment for bulk order',
    required: false,
  })
  remarks: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-15T00:00:00Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<SupplierDebtWithRelations>) {
    Object.assign(this, partial);

    if (partial.supplier) {
      this.supplier = new SupplierResponseDto(partial.supplier);
    }
  }
}
