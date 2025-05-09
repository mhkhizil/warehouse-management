import { ApiProperty } from '@nestjs/swagger';
import { SupplierResponseSchema } from './SupplierResponseSchema';

export class SupplierListResponseSchema {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({
    description: 'Response data',
    type: 'array',
    items: { $ref: '#/components/schemas/SupplierResponseSchema' },
    example: [
      {
        id: 1,
        name: 'AutoParts Inc.',
        phone: '+1 123-456-7890',
        email: 'contact@autoparts.com',
        address: '123 Parts Avenue, Autoville, CA 92000',
        contactPerson: 'John Smith',
        isActive: true,
        remarks: 'Preferred supplier for engine parts',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z',
      },
    ],
  })
  data: SupplierResponseSchema[];

  @ApiProperty({
    type: String,
    example: 'Suppliers retrieved successfully',
    description: 'Response message',
  })
  message: string;
}
