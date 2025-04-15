import { User } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export type UserFilter = {
  username?: string;
  email?: string;
  role?: string;
  skip?: number;
  take?: number;
};

export interface IUserRepository extends IBaseRepository<User, number> {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findWithFilters(
    filter: UserFilter,
  ): Promise<{ users: User[]; total: number }>;
}
