import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseOptionalBoolPipe
  implements PipeTransform<string | boolean | undefined, boolean | undefined>
{
  transform(value: string | boolean | undefined): boolean | undefined {
    // If no value provided, return undefined
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    // If already a boolean, return it
    if (typeof value === 'boolean') {
      return value;
    }

    // Handle string values
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();

      if (lowerValue === 'true' || lowerValue === '1') {
        return true;
      }

      if (lowerValue === 'false' || lowerValue === '0') {
        return false;
      }

      // Invalid boolean string
      throw new BadRequestException(
        `Invalid boolean value: "${value}". Expected "true", "false", "1", or "0".`,
      );
    }

    return undefined;
  }
}

