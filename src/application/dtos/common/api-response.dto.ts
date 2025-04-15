import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Response status', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation successful',
  })
  message: string;

  @ApiProperty({ description: 'Response data', example: null })
  data: T | null;

  @ApiProperty({ description: 'Error details if any', example: null })
  error: string | null;

  constructor(
    success: boolean,
    message: string,
    data: T | null = null,
    error: string | null = null,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(
    data: T,
    message = 'Operation successful',
  ): ApiResponseDto<T> {
    return new ApiResponseDto<T>(true, message, data, null);
  }

  static error<T>(
    message: string,
    error: string | null = null,
  ): ApiResponseDto<T> {
    return new ApiResponseDto<T>(false, message, null, error);
  }
}
