import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Current password (needed for certain operations)',
    required: false,
  })
  @IsOptional()
  @IsString()
  currentPassword?: string;
}
