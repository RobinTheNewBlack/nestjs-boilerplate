## 7. Exception Filters & Interceptors ใน NestJS

ทั้งสองตัวนี้ทำงาน "ครอบ" รอบๆ การทำงานของ Controller โดย **Interceptor** จะดักจับทั้ง Request ขาเข้าและ Response ขาออก ส่วน **Exception Filter** จะดักจับเฉพาะตอนที่เกิด Error ขึ้น

---

### 🧹 `filters/http-exception.filter.ts` (แผนกจัดรูปแบบ Error)

**หน้าที่:** ดักจับ Error ที่เกิดขึ้นในระบบแล้วจัด Format ให้เป็นรูปแบบ (`JSON`) แบบเดียวกันทั้งหมด ทำให้ Frontend นำไปแสดงผลหรือจัดการต่อได้ง่าย

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // จัด Format Error ให้ดูเป็นระดับมืออาชีพ
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: request['correlationId'], // ดึง Correlation ID มาตรวจสอบได้เลย
      message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message,
    });
  }
}
```

---

### 🎁 `interceptors/transform-response.interceptor.ts` (ตัวจัดรูปแบบ Response)

**หน้าที่:** ดักจับค่าที่ Controller ส่งกลับมา เพื่อนำมาจัดรูปแบบใหม่อีกครั้งให้เป็นมาตรฐานเดียวกันก่อนส่งกลับไปยัง Client

```typescript
// src/common/interceptors/transform-response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data: data, // ห่อข้อมูลทั้งหมดไว้ใน key ว่า `data`
      })),
    );
  }
}
```

---

### วิธีใช้งาน Filter และ Interceptor แบบ Global

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  await app.listen(3000);
}
bootstrap();
```

---
