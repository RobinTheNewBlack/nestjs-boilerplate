import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from '@prisma/client-runtime-utils';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError, PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError | PrismaClientValidationError, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Database error';

        if (exception instanceof PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2002':
                    statusCode = HttpStatus.CONFLICT;
                    message = `${this.getFieldName(exception)} already exists`;
                    break;
                case 'P2025':
                    statusCode = HttpStatus.NOT_FOUND;
                    message = 'Record not found';
                    break;
                case 'P2003':
                    statusCode = HttpStatus.BAD_REQUEST;
                    message = 'Related record not found';
                    break;
                case 'P2000':
                    statusCode = HttpStatus.BAD_REQUEST;
                    message = 'Input value is too long';
                    break;
            }
        } else if (exception instanceof PrismaClientValidationError) {
            statusCode = HttpStatus.BAD_REQUEST;
            message = 'Invalid data provided';
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
        });
    }

    private getFieldName(exception: PrismaClientKnownRequestError): string {
        const target = exception.meta?.target;
        if (Array.isArray(target) && target.length > 0) {
            return String(target[0]);
        }
        return 'Value';
    }
}
