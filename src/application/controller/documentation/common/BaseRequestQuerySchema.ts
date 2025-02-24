import { ApiParam, ApiProperty } from '@nestjs/swagger';

export class BaseRequestQuerySchema {
  @ApiProperty()
  id: string;
}
