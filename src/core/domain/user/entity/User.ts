import { UserRole } from 'src/core/common/type/UserEnum';

export class UserEntity {
  id: string;

  name: string;

  email: string;

  phone: string;

  role: UserRole;

  password: string;

  createdDate: Date;

  updatedDate: Date;

  constructor(
    id: string = '',
    name: string,
    email: string,
    phone: string,
    role: UserRole,
    password?: string,
    createdDate?: Date,
    updatedDate?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.role = role;
    this.password = password;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }

  public static toEntity(user: any): UserEntity {
    return new UserEntity(
      user?.id,
      user?.name,
      user?.email,
      user?.phone,
      user?.role,
      user?.password,
      user?.createdDate,
      user?.updatedDate,
    );
  }
}
