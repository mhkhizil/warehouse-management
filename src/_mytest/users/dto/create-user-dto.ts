import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['SELLER', 'BUYER', 'ADMIN'], { message: 'Valid Role is required' })
  role: 'SELLER' | 'BUYER' | 'ADMIN';

  @IsString()
  @IsNotEmpty()
  password: string;
}
