import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';

@Injectable()
export class GetUserUseCase {
  private readonly logger = new Logger(GetUserUseCase.name);

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}`);

    const user = await this.userRepository.findById(id);

    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getByUsername(username: string): Promise<User> {
    this.logger.log(`Fetching user with username: ${username}`);

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      this.logger.warn(`User with username ${username} not found`);
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }
}
