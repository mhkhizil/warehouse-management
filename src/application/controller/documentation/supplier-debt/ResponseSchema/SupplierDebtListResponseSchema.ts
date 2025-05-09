import { ApiProperty } from '@nestjs/swagger';
import { SupplierDebtResponseSchema } from './SupplierDebtResponseSchema';

export class SupplierDebtListResponseSchema {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({
    description: 'Response data',
    type: 'array',
    items: { $ref: '#/components/schemas/SupplierDebtResponseSchema' },
    example: [
      {
        id: 1,
        supplierId: 2,
        amount: 500.0,
        dueDate: '2023-12-31T00:00:00Z',
        isSettled: false,
        alertSent: false,
        remarks: 'For emergency purchase of spare parts',
        transactionId: 123,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z',
        supplier: {
          id: 2,
          name: 'AutoParts Inc.',
        },
      },
    ],
  })
  data: SupplierDebtResponseSchema[];

  @ApiProperty({
    type: String,
    example: 'Supplier debts retrieved successfully',
    description: 'Response message',
  })
  message: string;
}
