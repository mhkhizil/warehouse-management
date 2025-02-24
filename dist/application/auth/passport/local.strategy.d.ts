import { Strategy } from 'passport-local';
import { AuthService } from 'src/core/domain/auth/service/Authservice';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(phone: string, password: string): Promise<any>;
}
export {};
