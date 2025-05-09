import { ApiProperty } from '@nestjs/swagger';
import { SupplierResponseSchema } from './SupplierResponseSchema';

export class PaginatedSupplierResponseSchema {
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
      suppliers: {
        type: 'array',
        items: { $ref: '#/components/schemas/SupplierResponseSchema' },
        description: 'List of suppliers',
      },
      total: {
        type: 'number',
        example: 100,
        description: 'Total number of suppliers',
      },
    },
  })
  data: {
    suppliers: SupplierResponseSchema[];
    total: number;
  };

  @ApiProperty({
    type: String,
    example: 'Suppliers retrieved successfully',
    description: 'Response message',
  })
  message: string;
}
