import { ApiProperty } from '@nestjs/swagger';

export class BaseFilterSchema {
  @ApiProperty()
  take: number;

  @ApiProperty()
  skip: number;
}
