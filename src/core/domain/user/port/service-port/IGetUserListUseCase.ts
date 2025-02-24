import { IBaseUseCase } from 'src/core/common/base-usecase/port';
import { CreateUserDto } from '../../dto/CreateUserDto';

export abstract class IGetUserListUseCase extends IBaseUseCase<any, any> {}
