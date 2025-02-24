import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseSchema<T> {
  @ApiProperty({ type: 'string' })
  public message: string;

  @ApiProperty({ type: 'number' })
  public code: number;

  @ApiProperty({ type: 'object' })
  public data: T;
}
