import { BaseFilterSchema } from '../../common/BaseFilterSchema';
import { UserRole } from '@src/core/common/type/UserEnum';
export declare class UserFilterSchama extends BaseFilterSchema {
    name?: string;
    role?: UserRole;
}
