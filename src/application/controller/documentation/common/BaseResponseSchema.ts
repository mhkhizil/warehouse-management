import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseSchema<T> {
  @ApiProperty({ type: 'string', example: 'Success' })
  public message: string;

  @ApiProperty({ type: 'number', example: 200 })
  public code: number;

  @ApiProperty({ type: 'object' })
  public data: T;
}
