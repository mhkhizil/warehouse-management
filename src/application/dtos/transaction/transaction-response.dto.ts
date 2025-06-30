import { ApiProperty } from '@nestjs/swagger';
import {
  Customer,
  Debt,
  Supplier,
  SupplierDebt,
  Transaction,
  TransactionType,
  TransactionItem,
} from '@prisma/client';
import { Type } from 'class-transformer';
import { CustomerResponseDto } from '../customer/customer-response.dto';
import { DebtResponseDto } from '../debt/debt-response.dto';
import { SupplierResponseDto } from '../supplier/supplier-response.dto';
import { SupplierDebtResponseDto } from '../supplier-debt/supplier-debt-response.dto';
import { TransactionItemResponseDto } from './transaction-item-response.dto';

// Define interface with relations
interface TransactionWithRelations extends Transaction {
  customer?: Customer;
  supplier?: Supplier;
  debt?: Debt[];
  supplierDebt?: SupplierDebt[];
  transactionItems?: TransactionItem[];
}

export class TransactionResponseDto implements Partial<Transaction> {
  @ApiProperty({ description: 'Transaction ID', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.SELL,
  })
  type: TransactionType;

  @ApiProperty({ description: 'Customer ID', example: 1, required: false })
  customerId: number | null;

  @ApiProperty({
    description: 'Customer information',
    type: CustomerResponseDto,
    required: false,
  })
  @Type(() => CustomerResponseDto)
  customer?: CustomerResponseDto;

  @ApiProperty({ description: 'Supplier ID', example: 1, required: false })
  supplierId: number | null;

  @ApiProperty({
    description: 'Supplier information',
    type: SupplierResponseDto,
    required: false,
  })
  @Type(() => SupplierResponseDto)
  supplier?: SupplierResponseDto;

  @ApiProperty({
    description: 'Transaction items',
    type: [TransactionItemResponseDto],
  })
  @Type(() => TransactionItemResponseDto)
  transactionItems?: TransactionItemResponseDto[];

  @ApiProperty({ description: 'Total amount', example: 999.95 })
  totalAmount: number;

  @ApiProperty({
    description: 'Transaction date',
    example: '2023-01-01T00:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Associated debt records',
    type: [DebtResponseDto],
    required: false,
  })
  @Type(() => DebtResponseDto)
  debt?: DebtResponseDto[];

  @ApiProperty({
    description: 'Associated supplier debt records',
    type: [SupplierDebtResponseDto],
    required: false,
  })
  @Type(() => SupplierDebtResponseDto)
  supplierDebt?: SupplierDebtResponseDto[];

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-02T00:00:00Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<TransactionWithRelations>) {
    Object.assign(this, partial);

    if (partial.customer) {
      this.customer = new CustomerResponseDto(partial.customer);
    }

    if (partial.supplier) {
      this.supplier = new SupplierResponseDto(partial.supplier);
    }

    if (partial.debt) {
      this.debt = partial.debt.map((debt) => new DebtResponseDto(debt));
    }

    if (partial.supplierDebt) {
      this.supplierDebt = partial.supplierDebt.map(
        (supplierDebt) => new SupplierDebtResponseDto(supplierDebt),
      );
    }

    if (partial.transactionItems) {
      this.transactionItems = partial.transactionItems.map(
        (item) => new TransactionItemResponseDto(item),
      );
    }
  }
}
