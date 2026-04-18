import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
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

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as HttpExceptionResponse;

    // มาจาก ValidationPipe exceptionFactory → errors array พร้อม field
    const errors: ErrorField[] | undefined = exceptionResponse.errors;

    // message: ใช้จาก exceptionResponse ก่อน ถ้าไม่มีค่อย fallback
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message && !Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message
          : exception.message;

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(errors && errors.length > 0 && { errors }),
    });
  }
}
