import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  IUserRepository,
  UserFilter,
} from '../../../domain/interfaces/repositories/user.repository.interface';

@Injectable()
export class ListUsersUseCase {
  private readonly logger = new Logger(ListUsersUseCase.name);

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(filter: UserFilter): Promise<{ users: User[]; total: number }> {
    this.logger.log('Fetching users with filters');
    return await this.userRepository.findWithFilters(filter);
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    return await this.userRepository.findAll();
  }
}
