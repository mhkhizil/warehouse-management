import { ApiProperty } from '@nestjs/swagger';
import { Supplier } from '@prisma/client';

export class SupplierResponseDto implements Partial<Supplier> {
  @ApiProperty({ description: 'Supplier ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Supplier name', example: 'AutoParts Inc.' })
  name: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1 123-456-7890',
    required: false,
  })
  phone: string | null;

  @ApiProperty({
    description: 'Email address',
    example: 'contact@autoparts.com',
    required: false,
  })
  email: string | null;

  @ApiProperty({
    description: 'Physical address',
    example: '123 Parts Avenue, Autoville, CA 92000',
    required: false,
  })
  address: string | null;

  @ApiProperty({
    description: 'Contact person',
    example: 'John Smith',
    required: false,
  })
  contactPerson: string | null;

  @ApiProperty({ description: 'Whether the supplier is active', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Additional remarks',
    example: 'Preferred supplier for engine parts',
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

  constructor(partial: Partial<Supplier>) {
    Object.assign(this, partial);
  }
}
