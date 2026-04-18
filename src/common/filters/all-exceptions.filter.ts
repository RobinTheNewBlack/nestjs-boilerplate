import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorField {
  field: string;
  message: string;
}

interface HttpExceptionResponse {
  message: string | string[];
  errors?: ErrorField[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: ErrorField[] | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse =
        exception.getResponse() as HttpExceptionResponse;

      errors = exceptionResponse.errors;
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message &&
              !Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message
            : exception.message;
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(errors && errors.length > 0 && { errors }),
    });
  }
}
