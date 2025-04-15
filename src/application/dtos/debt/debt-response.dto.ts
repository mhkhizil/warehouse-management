import { ApiProperty } from '@nestjs/swagger';
import { Debt, Customer } from '@prisma/client';
import { Type } from 'class-transformer';
import { CustomerResponseDto } from '../customer/customer-response.dto';

// Define an interface that extends Debt to include relations
interface DebtWithRelations extends Debt {
  customer?: Customer;
}

export class DebtResponseDto {
  @ApiProperty({ description: 'Debt ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Customer ID', example: 1 })
  customerId: number;

  @ApiProperty({
    description: 'Customer information',
    type: CustomerResponseDto,
  })
  @Type(() => CustomerResponseDto)
  customer?: CustomerResponseDto;

  @ApiProperty({ description: 'Debt amount', example: 150.0 })
  amount: number;

  @ApiProperty({ description: 'Due date', example: '2023-02-01T00:00:00Z' })
  dueDate: Date;

  @ApiProperty({ description: 'Whether debt is settled', example: false })
  isSettled: boolean;

  @ApiProperty({ description: 'Whether alert has been sent', example: false })
  alertSent: boolean;

  @ApiProperty({ description: 'Remarks', example: 'Payment pending' })
  remarks: string | null;

  @ApiProperty({ description: 'Transaction ID if applicable', example: 42 })
  transactionId: number | null;

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

  constructor(partial: Partial<Debt> & { customer?: Partial<Customer> }) {
    Object.assign(this, partial);

    if (partial.customer) {
      this.customer = new CustomerResponseDto(partial.customer);
    }
  }
}
