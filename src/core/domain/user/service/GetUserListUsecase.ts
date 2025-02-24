import { Inject, Injectable } from '@nestjs/common';
import { UserFilter } from '../dto/UserFilter';
import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { CreateUserDto } from '../dto/CreateUserDto';
import { IGetUserListUseCase } from '../port/service-port/IGetUserListUseCase';

@Injectable()
export class GetUserListWithFilterUseCase implements IGetUserListUseCase {
  constructor(@Inject() private readonly userRepository: IUserRepository) {}
  public async execute(filter: UserFilter): Promise<any> {
    const list = await this.userRepository.findAllWithSchema(filter);

    return {
      users: list.users.map((product) => CreateUserDto.convertToClass(product)),
      totalCounts: list.totalCounts,
    };
  }
}
