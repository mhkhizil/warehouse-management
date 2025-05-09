import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseSchema {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id: number;

  @ApiProperty({ example: 'AutoParts Inc.', description: 'Supplier name' })
  name: string;

  @ApiProperty({ example: '+1 123-456-7890', description: 'Phone number', required: false })
  phone: string;

  @ApiProperty({ example: 'contact@autoparts.com', description: 'Email address', required: false })
  email: string;

  @ApiProperty({ example: '123 Parts Avenue, Autoville, CA 92000', description: 'Physical address', required: false })
  address: string;

  @ApiProperty({ example: 'John Smith', description: 'Primary contact person', required: false })
  contactPerson: string;

  @ApiProperty({ example: true, description: 'Whether the supplier is active' })
  isActive: boolean;

  @ApiProperty({ example: 'Offers discounts for bulk orders', description: 'Additional notes', required: false })
  remarks: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-15T00:00:00Z', description: 'Last update timestamp' })
  updatedAt: Date;
} 