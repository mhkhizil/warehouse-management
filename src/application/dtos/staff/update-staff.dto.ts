import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateStaffDto } from './create-staff.dto';

export class UpdateStaffDto extends PartialType(
  OmitType(CreateStaffDto, ['userId', 'user'] as const),
) {}
