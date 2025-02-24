import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';
import { GetUserResponse } from './GetUserResponseSchema';

export class GetUserListResponse {
  @ApiProperty({ type: [GetUserResponse] })
  users: GetUserResponse[];

  @ApiProperty()
  totalCounts: number;
}

export class GetUserListResponseSchema extends BaseResponseSchema<GetUserListResponse> {
  @ApiProperty({ type: GetUserListResponse })
  public data: GetUserListResponse;
}
