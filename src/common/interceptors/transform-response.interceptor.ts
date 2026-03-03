import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T> | void>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiResponse<T> | void> {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        return next.handle().pipe(
            map((data) => {
                // 204 No Content — ไม่ต้อง wrap body
                if (response.statusCode === 204 || data === undefined || data === null) {
                    return;
                }

                return {
                    success: true,
                    statusCode: response.statusCode,
                    message: this.resolveMessage(request.method, response.statusCode),
                    data,
                };
            }),
        );
    }

    private resolveMessage(method: string, statusCode: number): string {
        if (statusCode === 201) return 'Created successfully';

        switch (method.toUpperCase()) {
            case 'GET':    return 'Fetched successfully';
            case 'POST':   return 'Created successfully';
            case 'PUT':
            case 'PATCH':  return 'Updated successfully';
            case 'DELETE': return 'Deleted successfully';
            default:       return 'Success';
        }
    }
}
