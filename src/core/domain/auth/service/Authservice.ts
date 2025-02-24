import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { SinginUserDto } from '../dto/SigninUserDto';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../user/port/repository-port/IUserRepositoryPort';
import { PrismaUserRepository } from '../../user/repository/PrismaUserRepository';
import { PrismaClient } from '@prisma/client';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private userRepository: IUserRepository,
    @Inject() private jwtService: JwtService,
  ) {}
  async validateUser(credentials: SinginUserDto): Promise<string> {
    const result = await this.userRepository.find({ phone: credentials.phone });
    let isValid;
    if (result) {
      try {
        isValid = await verify(result.password, credentials.password);
      } catch (e) {
        return null;
      }

      if (isValid) {
        return this.jwtService.sign({
          id: result.id,
          email: result.email,
          role: result.role,
          phone: result.phone,
        });
      } else return null;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
