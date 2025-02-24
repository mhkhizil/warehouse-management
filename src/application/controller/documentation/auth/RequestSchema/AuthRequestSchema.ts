import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthRequestSchema {
  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  public phone: string;

  @ApiProperty({ type: 'string' })
  @IsNotEmpty()
  public password: string;
}
