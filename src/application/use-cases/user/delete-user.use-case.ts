import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
  private readonly logger = new Logger(DeleteUserUseCase.name);

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<boolean> {
    this.logger.log(`Deleting user with ID: ${id}`);

    // Check if user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Delete user
    return await this.userRepository.delete(id);
  }
}
