import { UserEntity } from '../../entity/User';
import { UpdateProfileDto } from '../../dto/UpdateProfileDto';
export interface IUpdateProfileUseCase {
    execute(userId: string, data: UpdateProfileDto): Promise<UserEntity>;
}
