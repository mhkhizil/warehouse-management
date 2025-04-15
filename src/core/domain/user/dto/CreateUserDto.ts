import { Expose, plainToInstance } from 'class-transformer';
import { UserRole } from 'src/core/common/type/UserEnum';
import { UserEntity } from '../entity/User';
import { Nullable } from 'src/core/common/type/CommonTypes';

export class CreateUserDto {
  @Expose()
  id: Nullable<string>;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  role: UserRole;

  password: string;

  @Expose()
  createdDate: Nullable<Date>;

  @Expose()
  updatedDate: Nullable<Date>;

  public static convertToClass(user: UserEntity) {
    return plainToInstance(CreateUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
