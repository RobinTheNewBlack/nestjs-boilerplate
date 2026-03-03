## 7. Exception Filters ใน NestJS

**Exception Filter** คือตัวดักจับ Error ที่เกิดขึ้นในระบบ เพื่อนำมาจัด Format ให้เป็นรูปแบบมาตรฐานเดียวกันก่อนส่งกลับไปยัง Client

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

### วิธีใช้งาน Filter แบบ Global

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
```

---
