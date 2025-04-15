import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for login',
    example: 'johnsmith',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ssw0rd',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.smith@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    default: Role.STAFF,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.STAFF;

  @ApiProperty({
    description: 'Additional remarks about the user',
    example: 'New hire for warehouse management',
    required: false,
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}
