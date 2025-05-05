import { Expose } from 'class-transformer';

export class UpdateProfileDto {
  @Expose()
  name?: string;

  @Expose()
  currentPassword?: string;

  @Expose()
  newPassword?: string;
}
