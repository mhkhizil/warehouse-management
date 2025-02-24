import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseSchema } from '../../common/BaseResponseSchema';

class AuthResponse {
  @ApiProperty({ type: 'string' })
  public token: string;
}

export class AuthResponseSchema extends BaseResponseSchema<AuthResponse> {
  @ApiProperty({ type: AuthResponse })
  public data: AuthResponse;

  constructor(token: string) {
    super();
    this.data = { token: token };
  }
}
