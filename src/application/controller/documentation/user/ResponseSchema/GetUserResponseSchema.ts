import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/core/common/type/UserEnum';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';

export class GetUserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  createdDate: Date;

  @ApiProperty({ type: Date })
  updatedDate: Date;
}

export class GetUserResonseSchema extends BaseResponseSchema<GetUserResponse> {
  @ApiProperty({ type: GetUserResponse })
  public data: GetUserResponse;
}
