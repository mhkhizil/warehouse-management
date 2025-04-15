import { ApiProperty } from '@nestjs/swagger';
import { Staff, User } from '@prisma/client';
import { Type } from 'class-transformer';
import { UserResponseDto } from '../user/user-response.dto';

// Define interface with relations
interface StaffWithRelations extends Staff {
  user?: User;
}

export class StaffResponseDto implements Partial<Staff> {
  @ApiProperty({ description: 'Staff ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  userId: number;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @ApiProperty({ description: 'Full name', example: 'John Smith' })
  fullName: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  phone: string | null;

  @ApiProperty({
    description: 'Staff permissions',
    example: {
      canEditItems: true,
      canViewReports: true,
      canManageStock: true,
    },
  })
  permissions: any;

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

  constructor(partial: Partial<Staff> & { user?: Partial<User> }) {
    Object.assign(this, partial);

    if (partial.user) {
      this.user = new UserResponseDto(partial.user);
    }
  }
}
