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
    console.log('📱 Received phone:', JSON.stringify(data?.phone));
    console.log('📱 Phone length:', data?.phone?.length);
    console.log(
      '📱 Phone char codes:',
      Array.from(data?.phone || '').map((c) => c.charCodeAt(0)),
    );
    const newUser = new UserEntity(
      null,
      data?.name,
      data?.email,
      data?.phone,
      data?.role,
      await hash(data?.password),
    );
    console.log('this is the new user from service', newUser);
    const createdUser = await this.userRepository.create(newUser);
    console.log('this is the creaeduser from service ' + createdUser);

    // Return the entity directly instead of converting to DTO
    return createdUser;
  }
}
