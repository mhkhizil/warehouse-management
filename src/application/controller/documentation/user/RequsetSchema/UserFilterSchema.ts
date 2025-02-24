import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterSchema } from '../../common/BaseFilterSchema';
import { UserRole } from '@src/core/common/type/UserEnum';

export class UserFilterSchama extends BaseFilterSchema {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  role?: UserRole;
}
