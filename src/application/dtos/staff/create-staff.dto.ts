import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from '../user/create-user.dto';

export class StaffPermissionsDto {
  @ApiProperty({ description: 'Can edit items', default: false })
  @IsOptional()
  canEditItems?: boolean = false;

  @ApiProperty({ description: 'Can view reports', default: false })
  @IsOptional()
  canViewReports?: boolean = false;

  @ApiProperty({ description: 'Can manage stock', default: false })
  @IsOptional()
  canManageStock?: boolean = false;

  @ApiProperty({ description: 'Can manage customers', default: false })
  @IsOptional()
  canManageCustomers?: boolean = false;

  @ApiProperty({ description: 'Can manage transactions', default: false })
  @IsOptional()
  canManageTransactions?: boolean = false;

  @ApiProperty({ description: 'Can manage debt', default: false })
  @IsOptional()
  canManageDebt?: boolean = false;
}

export class CreateStaffDto {
  @ApiProperty({
    description: 'The full name of the staff member',
    example: 'John Smith',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Staff phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Please provide a valid phone number' })
  phone?: string;

  @ApiProperty({
    description: 'Staff permissions',
    type: StaffPermissionsDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => StaffPermissionsDto)
  permissions: StaffPermissionsDto;

  @ApiProperty({
    description: 'Related user ID if already created',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({
    description:
      'User information for new staff member if user does not exist yet',
    type: CreateUserDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user?: CreateUserDto;
}
