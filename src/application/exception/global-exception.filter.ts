import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { CoreApiResonseSchema } from '@src/core/common/schema/ApiResponseSchema';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500;
    let message = 'unexpected error occur';
    let errorDetails: unknown;

    // Determine the status code
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Extract the message from the exception response
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        if ('message' in exceptionResponse) {
          // Handle array messages (e.g., validation errors)
          const msg: string = exceptionResponse['message'] as string;
          message = Array.isArray(msg) ? msg.join(', ') : (msg as string);
        }
        if ('error' in exceptionResponse) {
          errorDetails = exceptionResponse['error'];
        }
      }
    } else if (exception instanceof Error) {
      // Capture error details for non-HttpException errors
      errorDetails = exception.message;
    }

    const coreResponse = CoreApiResonseSchema.error<unknown>(
      status,
      message,
      errorDetails,
    );

    response.status(status).json(coreResponse);
  }
}
