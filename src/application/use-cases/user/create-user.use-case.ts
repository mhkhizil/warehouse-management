import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
import { USER_REPOSITORY } from '../../../domain/constants/repository.tokens';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with username: ${createUserDto.username}`);

    // Check if username already exists
    const existingUserByUsername = await this.userRepository.findByUsername(
      createUserDto.username,
    );

    if (existingUserByUsername) {
      this.logger.warn(`Username ${createUserDto.username} already exists`);
      throw new BadRequestException('Username already exists');
    }

    // Check if email already exists if provided
    if (createUserDto.email) {
      const existingUserByEmail = await this.userRepository.findByEmail(
        createUserDto.email,
      );

      if (existingUserByEmail) {
        this.logger.warn(`Email ${createUserDto.email} already exists`);
        throw new BadRequestException('Email already exists');
      }
    }

    // Hash password
    const hashedPassword = await argon2.hash(createUserDto.password);

    // Create user with hashed password
    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    this.logger.log(`User created with ID: ${newUser.id}`);
    return newUser;
  }
}
