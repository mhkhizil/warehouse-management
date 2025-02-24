import { AuthService } from 'src/core/domain/auth/service/Authservice';
import { AuthRequestSchema } from './documentation/auth/RequestSchema/AuthRequestSchema';
import { CoreApiResonseSchema } from 'src/core/common/schema/ApiResponseSchema';
import { CreateUserSchema } from './documentation/user/RequsetSchema/CreateUserRequestSchema';
import { CreateUserUseCase } from 'src/core/domain/user/service/CreateUserUsecase';
export declare class AuthController {
    private authService;
    private createUserUseCase;
    constructor(authService: AuthService, createUserUseCase: CreateUserUseCase);
    SignIn(credential: AuthRequestSchema): Promise<CoreApiResonseSchema<any>>;
    Login(user: CreateUserSchema): Promise<CoreApiResonseSchema<any>>;
}
