import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SinginUserDto {
  @IsEmail()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
