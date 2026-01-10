import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterSchema } from '../../common/BaseFilterSchema';
import { UserRole } from '@src/core/common/type/UserEnum';
import { UserSortBy, SortOrder } from '@src/core/domain/user/dto/UserFilter';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UserFilterSchama extends BaseFilterSchema {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @ApiProperty({
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    enum: UserSortBy,
    enumName: 'UserSortBy',
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(UserSortBy)
  sortBy?: UserSortBy;

  @ApiPropertyOptional({
    enum: SortOrder,
    enumName: 'SortOrder',
    description: 'Sort direction (asc or desc)',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}
