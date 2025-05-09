import { ApiProperty } from '@nestjs/swagger';

export class BuyFromSupplierRequestSchema {
  @ApiProperty({
    example: 1,
    description: 'ID of the supplier',
  })
  supplierId: number;

  @ApiProperty({
    example: 2,
    description: 'ID of the item being purchased',
  })
  itemId: number;

  @ApiProperty({
    example: 10,
    description: 'Quantity of items to purchase',
  })
  quantity: number;

  @ApiProperty({
    example: 25.5,
    description: 'Price per unit',
  })
  unitPrice: number;

  @ApiProperty({
    example: true,
    description: 'Whether to create a debt record for this purchase',
    required: false,
  })
  createDebt?: boolean;

  @ApiProperty({
    example: '2024-04-30T00:00:00Z',
    description: 'Due date for debt payment (required if createDebt is true)',
    required: false,
  })
  debtDueDate?: string;

  @ApiProperty({
    example: 'Payment for bulk order of auto parts',
    description: 'Additional remarks for the debt record',
    required: false,
  })
  debtRemarks?: string;
}
