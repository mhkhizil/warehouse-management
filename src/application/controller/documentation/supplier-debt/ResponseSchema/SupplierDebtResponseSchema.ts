import { ApiProperty } from '@nestjs/swagger';

export class SupplierDebtResponseSchema {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id: number;

  @ApiProperty({ example: 2, description: 'Supplier ID' })
  supplierId: number;

  @ApiProperty({ example: 500.00, description: 'Debt amount' })
  amount: number;

  @ApiProperty({ example: '2023-12-31T00:00:00Z', description: 'Due date for payment' })
  dueDate: Date;

  @ApiProperty({ example: false, description: 'Whether the debt has been settled' })
  isSettled: boolean;

  @ApiProperty({ example: false, description: 'Whether a payment reminder has been sent' })
  alertSent: boolean;

  @ApiProperty({ example: 123, description: 'Associated transaction ID', required: false })
  transactionId: number;

  @ApiProperty({ example: 'For emergency purchase of spare parts', description: 'Additional notes', required: false })
  remarks: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-15T00:00:00Z', description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ 
    type: 'object', 
    required: false,
    description: 'Related supplier information',
    properties: {
      id: { type: 'number', example: 2 },
      name: { type: 'string', example: 'AutoParts Inc.' }
    }
  })
  supplier?: { id: number; name: string };
} 