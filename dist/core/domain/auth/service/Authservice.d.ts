import { SinginUserDto } from '../dto/SigninUserDto';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../user/port/repository-port/IUserRepositoryPort';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: IUserRepository, jwtService: JwtService);
    validateUser(credentials: SinginUserDto): Promise<string>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
