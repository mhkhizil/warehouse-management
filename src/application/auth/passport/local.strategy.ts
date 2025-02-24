import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { SinginUserDto } from 'src/core/domain/auth/dto/SigninUserDto';
import { AuthService } from 'src/core/domain/auth/service/Authservice';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phone', // Specify the field name for phone
      passwordField: 'password', // This is the default, but you can specify it explicitly
    });
  }

  async validate(phone: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({
      phone: phone,
      password: password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
