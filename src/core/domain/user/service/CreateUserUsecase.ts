import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { ICreateUserUseCase } from '../port/service-port/ICreateUserUseCase';
import { UserEntity } from '../entity/User';
import { CreateUserDto } from '../dto/CreateUserDto';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { hash } from 'argon2';

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(@Inject() private readonly userRepository: IUserRepository) {}
  public async execute(data?: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity(
      null,
      data?.name,
      data?.email,
      data?.phone,
      data?.role,
      await hash(data?.password),
    );
    const createdUser = await this.userRepository.create(newUser);

    // Return the entity directly instead of converting to DTO
    return createdUser;
  }
}
