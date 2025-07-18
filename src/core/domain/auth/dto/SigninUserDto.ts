import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SinginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
