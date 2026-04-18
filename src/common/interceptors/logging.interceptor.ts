import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { RequestWithUser } from '@/common/interfaces';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithUser>();
    const response = http.getResponse();

    // ── ดึงข้อมูลจาก request ──
    const method = request.method; // GET, POST, PUT, DELETE
    const url = request.originalUrl; // /api/v1/customers?page=1
    const ip = String(request.headers['x-forwarded-for'] ?? request.ip)
      .split(',')[0]
      .trim(); // IP ของ client
    const correlationId = request.correlationId || '-'; // จาก CorrelationIdMiddleware
    const userId =
      request.user?.sub || (request as any).user?.id || 'anonymous'; // จาก JwtAuthGuard
    const body = this.sanitizeBody(request.body); // ซ่อน password

    // ── ขาเข้า: Log request ──
    const start = Date.now();
    this.logger.log(
      `→ [${correlationId}] ${method} ${url} — user:${userId} — ip:${ip}`,
    );

    // Log request body เฉพาะ POST/PUT (debug mode)
    if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
      this.logger.debug(`→ [${correlationId}] Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      // ── ขาออก: Log response สำเร็จ ──
      tap((data) => {
        const duration = Date.now() - start;
        const statusCode = response.statusCode;

        this.logger.log(
          `← [${correlationId}] ${method} ${url} ${statusCode} — ${duration}ms`,
        );

        // ⚠️ แจ้งเตือนถ้าช้า
        if (duration > 3000) {
          this.logger.warn(
            `🐌 SLOW [${correlationId}] ${method} ${url} — ${duration}ms`,
          );
        }

        // Debug mode: log response data (เฉพาะ development)
        if (process.env.NODE_ENV === 'development') {
          const json = JSON.stringify(data) ?? '';
          const preview =
            json.length > 200 ? json.substring(0, 200) + '...' : json;
          this.logger.debug(`← [${correlationId}] Response: ${preview}`);
        }
      }),

      // ── ขาออก: Log error ──
      catchError((err) => {
        const duration = Date.now() - start;
        const statusCode = err.status || 500;

        this.logger.error(
          `✖ [${correlationId}] ${method} ${url} ${statusCode} — ${duration}ms — ${err.message}`,
        );

        // Log stack trace เฉพาะ 500 errors
        if (statusCode >= 500) {
          this.logger.error(`Stack: ${err.stack}`);
        }

        // ส่ง error ต่อให้ ExceptionFilter จัดการ
        return throwError(() => err);
      }),
    );
  }

  /**
   * ซ่อน field sensitive ก่อน log
   * ป้องกัน password, credit card หลุดเข้า log
   */
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'confirmPassword',
      'token',
      'creditCard',
      'cvv',
    ];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***HIDDEN***';
      }
    }

    return sanitized;
  }
}
