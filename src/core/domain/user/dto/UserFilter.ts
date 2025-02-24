import { UserRole } from '@src/core/common/type/UserEnum';
import { BaseFilterSchema } from 'src/core/common/schema/BaseFilterSchema';

export class UserFilter extends BaseFilterSchema {
  name?: string;
  role?: UserRole;
  constructor(name: string, role: UserRole, take: number, skip: number) {
    super(take, skip);
    this.name = name || '';
    this.role = role;
  }
}
