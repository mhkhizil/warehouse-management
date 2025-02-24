import { IBaseRepository } from 'src/core/common/base-repository/port';
import { UserEntity } from '../../entity/User';
import { Injectable } from '@nestjs/common';
import { UserFilter } from '../../dto/UserFilter';

@Injectable()
export abstract class IUserRepository
  implements
    IBaseRepository<UserEntity, { id?: string; email?: string; name?: string }>
{
  abstract create: (entity: UserEntity) => Promise<UserEntity>;
  abstract delete: (id: string) => Promise<boolean>;
  abstract find: (by: {
    id?: string;
    email?: string;
    name?: string;
    phone?: string;
  }) => Promise<UserEntity | null>;
  abstract findAll: () => Promise<UserEntity[]>;
  abstract update: (entity: UserEntity) => Promise<UserEntity>;
  abstract findAllWithSchema: (
    filter: UserFilter,
  ) => Promise<{ users: UserEntity[]; totalCounts: number }>;
}
