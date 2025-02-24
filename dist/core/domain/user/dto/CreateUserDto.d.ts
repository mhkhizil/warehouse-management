import { UserRole } from 'src/core/common/type/UserEnum';
import { UserEntity } from '../entity/User';
import { Nullable } from 'src/core/common/type/CommonTypes';
export declare class CreateUserDto {
    id: Nullable<string>;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
    createdDate: Nullable<Date>;
    updatedDate: Nullable<Date>;
    static convertToClass(user: UserEntity): CreateUserDto;
}
