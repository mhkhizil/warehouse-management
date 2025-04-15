import { Inject, Injectable } from '@nestjs/common';
import { UserFilter } from '../dto/UserFilter';
import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { IGetUserListUseCase } from '../port/service-port/IGetUserListUseCase';
import { UserEntity } from '../entity/User';

@Injectable()
export class GetUserListWithFilterUseCase implements IGetUserListUseCase {
  constructor(@Inject() private readonly userRepository: IUserRepository) {}
  public async execute(
    filter: UserFilter,
  ): Promise<{ users: UserEntity[]; totalCounts: number }> {
    const list = await this.userRepository.findAllWithSchema(filter);

    return {
      users: list.users,
      totalCounts: list.totalCounts,
    };
  }
}
