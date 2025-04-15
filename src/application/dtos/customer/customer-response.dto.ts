import { ApiProperty } from '@nestjs/swagger';
import { Customer, Debt } from '@prisma/client';
import { Type } from 'class-transformer';

// Define interface with relations
interface CustomerWithRelations extends Customer {
  debt?: Debt[];
}

export class CustomerDebtDto implements Partial<Debt> {
  @ApiProperty({ description: 'Debt ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Debt amount', example: 150.0 })
  amount: number;

  @ApiProperty({ description: 'Due date', example: '2023-02-01T00:00:00Z' })
  dueDate: Date;

  @ApiProperty({ description: 'Whether debt is settled', example: false })
  isSettled: boolean;

  @ApiProperty({ description: 'Whether alert has been sent', example: false })
  alertSent: boolean;

  @ApiProperty({ description: 'Transaction ID if applicable', example: 42 })
  transactionId: number | null;

  @ApiProperty({ description: 'Remarks', example: 'Payment pending' })
  remarks: string | null;

  constructor(partial: Partial<Debt>) {
    Object.assign(this, partial);
  }
}

export class CustomerResponseDto implements Partial<Customer> {
  @ApiProperty({ description: 'Customer ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Customer name', example: 'John Smith' })
  name: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  phone: string | null;

  @ApiProperty({
    description: 'Email address',
    example: 'john.smith@example.com',
  })
  email: string | null;

  @ApiProperty({
    description: 'Address',
    example: '123 Main St, Anytown, AT 12345',
  })
  address: string | null;

  @ApiProperty({
    description: 'Customer debts',
    type: [CustomerDebtDto],
    required: false,
  })
  @Type(() => CustomerDebtDto)
  debt?: CustomerDebtDto[];

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

  constructor(partial: Partial<Customer> & { debt?: Partial<Debt>[] }) {
    Object.assign(this, partial);

    if (partial.debt) {
      this.debt = partial.debt.map((d) => new CustomerDebtDto(d));
    }
  }
}
