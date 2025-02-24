import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/core/common/type/UserEnum';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';

class CreateUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  createdDate: string;

  @ApiProperty()
  updatedDate: string;
}

export class CreateUserResonseSchema extends BaseResponseSchema<CreateUserResponse> {
  @ApiProperty({ type: CreateUserResponse })
  public data: CreateUserResponse;
}
