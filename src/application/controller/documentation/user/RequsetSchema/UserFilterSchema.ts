import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterSchema } from '../../common/BaseFilterSchema';
import { UserRole } from '@src/core/common/type/UserEnum';
import { UserSortBy, SortOrder } from '@src/core/domain/user/dto/UserFilter';

export class UserFilterSchama extends BaseFilterSchema {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  role?: UserRole;

  @ApiPropertyOptional({
    enum: UserSortBy,
    enumName: 'UserSortBy',
    description: 'Field to sort by',
  })
  sortBy?: UserSortBy;

  @ApiPropertyOptional({
    enum: SortOrder,
    enumName: 'SortOrder',
    description: 'Sort direction (asc or desc)',
  })
  sortOrder?: SortOrder;
}
