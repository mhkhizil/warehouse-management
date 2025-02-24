import { IUserRepository } from '../port/repository-port/IUserRepositoryPort';
import { ICreateUserUseCase } from '../port/service-port/ICreateUserUseCase';
import { UserEntity } from '../entity/User';
import { CreateUserDto } from '../dto/CreateUserDto';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { hash } from 'argon2';
import { IGetUserUseCase } from '../port/service-port/IGetUserUseCase';

@Injectable()
export class GetUserUseCase implements IGetUserUseCase {
  constructor(@Inject() private readonly userRepository: IUserRepository) {}
  public async execute(id?: string): Promise<any> {
    const createdUser = await this.userRepository.find({ id: id });
    return CreateUserDto.convertToClass(createdUser);
  }
}
