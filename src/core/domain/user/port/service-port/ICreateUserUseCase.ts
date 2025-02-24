import { IBaseUseCase } from 'src/core/common/base-usecase/port';
import { CreateUserDto } from '../../dto/CreateUserDto';

export abstract class ICreateUserUseCase extends IBaseUseCase<CreateUserDto, any> {}
