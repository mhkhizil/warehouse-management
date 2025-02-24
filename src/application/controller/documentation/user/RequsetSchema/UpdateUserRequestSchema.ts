import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/core/common/type/UserEnum';

export class UpdateUserRequestSchema {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole, { message: 'Valid Role is required' })
  role: UserRole;
}
