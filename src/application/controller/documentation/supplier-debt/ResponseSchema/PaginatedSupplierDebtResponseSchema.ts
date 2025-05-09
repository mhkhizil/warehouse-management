import { ApiProperty } from '@nestjs/swagger';
import { SupplierDebtResponseSchema } from './SupplierDebtResponseSchema';

export class PaginatedSupplierDebtResponseSchema {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({
    description: 'Response data',
    type: 'object',
    properties: {
      debts: {
        type: 'array',
        items: { $ref: '#/components/schemas/SupplierDebtResponseSchema' },
        description: 'List of supplier debts',
      },
      total: {
        type: 'number',
        example: 50,
        description: 'Total number of supplier debts',
      },
    },
  })
  data: {
    debts: SupplierDebtResponseSchema[];
    total: number;
  };

  @ApiProperty({
    type: String,
    example: 'Supplier debts retrieved successfully',
    description: 'Response message',
  })
  message: string;
}
