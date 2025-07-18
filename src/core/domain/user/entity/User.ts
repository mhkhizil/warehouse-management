import { UserRole } from 'src/core/common/type/UserEnum';
import { User as PrismaUser } from '@prisma/client';

export class UserEntity {
  id: string;

  name: string;

  email: string;

  phone: string;

  profileImageUrl: string;

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
    profileImageUrl?: string,
    createdDate?: Date,
    updatedDate?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.role = role;
    this.password = password;
    this.profileImageUrl = profileImageUrl;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }

  public static toEntity(user: PrismaUser): UserEntity {
    return new UserEntity(
      user?.id?.toString(),
      user?.username,
      user?.email,
      user?.phone,
      user?.role as unknown as UserRole,
      user?.password,
      user?.profileImageUrl,
      user?.createdAt,
      user?.updatedAt,
    );
  }
}
