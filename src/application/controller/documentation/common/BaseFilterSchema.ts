import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class BaseFilterSchema {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  take: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip: number;
}
