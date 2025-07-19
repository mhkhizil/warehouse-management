import { BaseFilterSchema } from '../../common/BaseFilterSchema';
import { UserRole } from '@src/core/common/type/UserEnum';
import { UserSortBy, SortOrder } from '@src/core/domain/user/dto/UserFilter';
export declare class UserFilterSchama extends BaseFilterSchema {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    sortBy?: UserSortBy;
    sortOrder?: SortOrder;
}
