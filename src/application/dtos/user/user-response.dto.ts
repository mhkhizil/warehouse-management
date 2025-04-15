import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements Partial<User> {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Username', example: 'johnsmith' })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.smith@example.com',
  })
  email: string | null;

  @ApiProperty({ description: 'User role', enum: Role, example: 'STAFF' })
  role: Role;

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

  @ApiProperty({
    description: 'Additional remarks',
    example: 'Warehouse manager',
    required: false,
  })
  remarks: string | null;

  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
