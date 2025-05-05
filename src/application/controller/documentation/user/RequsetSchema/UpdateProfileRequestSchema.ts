import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileRequestSchema {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  currentPassword?: string;

  @ApiProperty({ required: false })
  newPassword?: string;
}
