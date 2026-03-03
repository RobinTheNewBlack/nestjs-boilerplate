## 7. Interceptors ใน NestJS

**Interceptor** คือตัวดักจับที่ทำงาน "ครอบ" รอบๆ Controller โดยสามารถดักทั้ง **Request ขาเข้า** (ก่อนเข้า Controller) และ **Response ขาออก** (หลังจาก Controller ตอบกลับ) ในฟังก์ชัน `intercept()` เดียวกัน

---

### ➡️⬅️ ขาเข้า vs ขาออก — จุดสังเกตคือ `next.handle()`

ความสับสนที่เกิดขึ้นบ่อยคือ โค้ดทั้ง "ขาเข้า" และ "ขาออก" ถูกเขียนอยู่ในฟังก์ชัน `intercept()` เดียวกัน จุดที่ใช้แบ่งแยกทั้งสองฝั่งคือคำสั่ง **`next.handle()`** — ให้มองว่าคำสั่งนี้คือ "ตัว Controller" เลย

| ตำแหน่ง | ชื่อ | สิ่งที่ทำได้ |
|---|---|---|
| โค้ด **ก่อน** `next.handle()` | ➡️ ขาเข้า | ดู/แก้ไข Request, จับเวลาเริ่มต้น |
| โค้ดใน **`.pipe(...)`** ต่อท้าย `next.handle()` | ⬅️ ขาออก | ดู/แปลง Response, คำนวณเวลาที่ใช้ |

```
Client → [➡️ ขาเข้า] → next.handle() (Controller ทำงาน) → [⬅️ ขาออก .pipe()] → Client
```

---

### 💡 สูตรจำง่าย

- อะไรที่อยู่ **นอก** `.pipe()` = **ขาเข้า** (ดัดแปลง Request ได้)
- อะไรที่อยู่ **ใน** `.pipe(...)` = **ขาออก** (ดัดแปลง Response ได้)

---

### 📋 ตัวอย่าง: `LoggingInterceptor` (ทำงานทั้งสองขา)

```typescript
// src/common/interceptors/logging.interceptor.ts
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
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse();

    // ── ดึงข้อมูลจาก request ──
    const method = request.method;                                                            // GET, POST, PUT, DELETE
    const url = request.originalUrl;                                                          // /api/v1/customers?page=1
    const ip = String(request.headers['x-forwarded-for'] ?? request.ip).split(',')[0].trim(); // IP ของ client
    const correlationId = request['correlationId'] || '-';                                    // จาก CorrelationIdMiddleware
    const userId = request['user']?.id || 'anonymous';                                        // จาก JwtAuthGuard
    const body = this.sanitizeBody(request.body);                                             // ซ่อน password

    // ── ขาเข้า: Log request ──
    const start = Date.now();
    this.logger.log(
      `→ [${correlationId}] ${method} ${url} — user:${userId} — ip:${ip}`,
    );

    // Log request body เฉพาะ POST/PUT/PATCH (debug mode)
    if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
      this.logger.debug(
        `→ [${correlationId}] Body: ${JSON.stringify(body)}`,
      );
    }

    return next.handle().pipe(
      // ── ขาออก: Log response สำเร็จ ──
      tap((data) => {
        const duration = Date.now() - start;
        const statusCode = response.statusCode;

        this.logger.log(
          `← [${correlationId}] ${method} ${url} ${statusCode} — ${duration}ms`,
        );

        // แจ้งเตือนถ้าช้าเกิน 3 วินาที
        if (duration > 3000) {
          this.logger.warn(
            `🐌 SLOW [${correlationId}] ${method} ${url} — ${duration}ms`,
          );
        }

        // Debug mode: log response data (เฉพาะ development)
        if (process.env.NODE_ENV === 'development') {
          const json = JSON.stringify(data) ?? '';
          const preview = json.length > 200 ? json.substring(0, 200) + '...' : json;
          this.logger.debug(
            `← [${correlationId}] Response: ${preview}`,
          );
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

  // ซ่อน field sensitive ก่อน log เพื่อป้องกัน password, credit card หลุดเข้า log
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'confirmPassword', 'token', 'creditCard', 'cvv'];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***HIDDEN***';
      }
    }

    return sanitized;
  }
}
```

#### สิ่งที่โค้ดนี้ทำ

**ขาเข้า (ก่อน `next.handle()`):**

| ตัวแปร | ค่าที่ดึงมา | วัตถุประสงค์ |
|---|---|---|
| `method` | `GET`, `POST`, ... | บอกว่าเป็น HTTP method อะไร |
| `url` | `/api/v1/users?page=1` | URL เต็มรวม query string |
| `ip` | `192.168.1.1` | IP ของผู้ร้องขอ (รองรับ `x-forwarded-for` ด้วย) |
| `correlationId` | UUID จาก middleware | ใช้ติดตาม request ข้าม service |
| `userId` | id จาก JWT token | รู้ว่าใครเป็นคนร้องขอ |
| `body` | request body ที่ผ่าน sanitize | log โดยไม่หลุด sensitive data |

หลังจากดึงข้อมูลแล้ว จะ log ข้อมูล request ขาเข้าทันที และถ้าเป็น `POST/PUT/PATCH` จะ log body ในระดับ `debug` ด้วย

**ขาออก — `.pipe()` มี 2 branch:**

1. **`tap(data)`** — ทำงานเมื่อ Controller ส่งค่ากลับสำเร็จ
   - คำนวณ `duration = Date.now() - start` เพื่อวัดเวลาที่ใช้
   - Log status code และ duration
   - ถ้าช้าเกิน **3,000ms** → warn ว่า `SLOW`
   - ถ้าเป็น `development` → debug log response body 200 ตัวอักษรแรก
   - `tap` ไม่แก้ไข response — แค่แอบดูแล้วปล่อยผ่าน

2. **`catchError(err)`** — ทำงานเมื่อเกิด exception ใดๆ
   - Log error พร้อม status code และ duration
   - ถ้าเป็น 500+ → log stack trace เพิ่ม
   - `throwError(() => err)` — re-throw error ต่อให้ **ExceptionFilter** จัดการต่อ

**`sanitizeBody()`:**

ก่อน log body จะ clone object แล้วแทนที่ค่าของ field ที่ sensitive (`password`, `token`, `creditCard`, ฯลฯ) ด้วย `***HIDDEN***` เพื่อป้องกันข้อมูลสำคัญหลุดเข้า log

#### ตัวอย่าง output ที่จะเห็นใน console

```
[HTTP] → [abc-123] POST /api/v1/auth/login — user:anonymous — ip:127.0.0.1
[HTTP] → [abc-123] Body: {"email":"user@example.com","password":"***HIDDEN***"}
[HTTP] ← [abc-123] POST /api/v1/auth/login 201 — 45ms
```

---

### 🎁 `interceptors/transform-response.interceptor.ts` (ทำงานขาออก)

**หน้าที่:** ตัวจัดรูปแบบ Response โดยดักจับค่าที่ Controller ส่งกลับมา เพื่อนำมาจัดรูปแบบใหม่ให้เป็นมาตรฐานเดียวกันก่อนส่งกลับไปยัง Client — ทำงานเฉพาะ **ขาออก** ผ่าน `map`

```typescript
// src/common/interceptors/transform-response.interceptor.ts
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
```

#### สิ่งที่โค้ดนี้ทำ

**`ApiResponse<T>` interface — รูปแบบ Response มาตรฐาน:**

```typescript
{
  success: true,
  statusCode: 200,
  message: "Fetched successfully",
  data: { ... }  // ข้อมูลจริงที่ Controller ส่งมา
}
```

ทุก response ที่สำเร็จจะถูกห่อด้วย shape นี้เสมอ ทำให้ Client ไม่ต้องเดาว่า API แต่ละตัวส่งข้อมูลมาในรูปแบบไหน

**`intercept()` — ดึง Request และ Response จาก context:**

ต่างจาก `LoggingInterceptor` ที่ดึงเฉพาะ `request` ตัวนี้ดึงทั้ง `request` และ `response` เพราะต้องการ **status code จริงที่ Express กำหนดไว้** (เช่น 200, 201) และ **HTTP method** เพื่อสร้าง message ที่เหมาะสม

**`map((data) => ...)` — แปลง Response ขาออก:**

`map` ใน RxJS คือตัวแปลงค่าที่ออกมาจาก stream — ทำงานเหมือน `Array.map()` แต่กับ Observable แทน

| เงื่อนไข | สิ่งที่เกิดขึ้น |
|---|---|
| `statusCode === 204` | return `undefined` — ไม่ห่อ body เพราะ 204 No Content ไม่ควรมี body |
| `data === undefined \|\| null` | return `undefined` — เช่นเดียวกัน ป้องกัน body ว่างถูกห่อโดยไม่จำเป็น |
| กรณีอื่นทั้งหมด | ห่อข้อมูลด้วย `ApiResponse<T>` shape |

**`resolveMessage()` — สร้าง message อัตโนมัติตาม HTTP method:**

| เงื่อนไข | message |
|---|---|
| `statusCode === 201` | `"Created successfully"` (ตรวจ status code ก่อน method เพราะ POST บางครั้งอาจคืน 200) |
| `GET` | `"Fetched successfully"` |
| `POST` | `"Created successfully"` |
| `PUT` / `PATCH` | `"Updated successfully"` |
| `DELETE` | `"Deleted successfully"` |
| อื่นๆ | `"Success"` |

#### ตัวอย่าง output ที่จะเห็น

**GET /users/1 → 200:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Fetched successfully",
  "data": { "id": 1, "name": "Alice" }
}
```

**POST /users → 201:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Created successfully",
  "data": { "id": 2, "name": "Bob" }
}
```

**DELETE /users/1 → 204:**
```
(no body)
```

---

### ⏱️ `interceptors/timeout.interceptor.ts` (ทำงานขาออก)

**หน้าที่:** จำกัดเวลาที่แต่ละ Request อนุญาตให้ใช้ได้ — ถ้า Controller (หรือ Service) ใช้เวลาเกินกำหนด จะโยน `RequestTimeoutException` (HTTP 408) ทันที แทนที่จะรอค้างไว้ตลอดไป

```typescript
// src/common/interceptors/timeout.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    constructor(private readonly ms: number = 5000) { }

    intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(this.ms),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError(() => new RequestTimeoutException(
                        `Request timed out after ${this.ms}ms`,
                    ));
                }
                return throwError(() => err);
            }),
        );
    }
}
```

#### สิ่งที่โค้ดนี้ทำ

**Constructor รับ `ms` — กำหนด timeout แบบยืดหยุ่น:**

```typescript
constructor(private readonly ms: number = 5000) { }
```

ค่า default คือ **5,000ms (5 วินาที)** แต่สามารถส่งค่าอื่นเข้ามาได้ตอน instantiate เช่น `new TimeoutInterceptor(10000)` สำหรับ endpoint ที่ต้องการเวลามากกว่าปกติ

**ทำงานเฉพาะขาออก — ทั้งหมดอยู่ใน `.pipe()`:**

`_context` ถูก prefix ด้วย `_` เพราะ Interceptor นี้ไม่ต้องการดึงข้อมูลจาก request เลย — มันไม่แตะ request ขาเข้า เพียงแค่ดูแลว่า response ขาออกมาทันเวลาหรือไม่

**`.pipe()` มี 2 operator ต่อกัน:**

| Operator | หน้าที่ |
|---|---|
| `timeout(this.ms)` | ถ้า Observable ไม่ emit ค่าภายใน `ms` มิลลิวินาที → โยน `TimeoutError` เข้า stream |
| `catchError(err)` | ดักจับ error ทุกชนิดที่ออกมาจาก stream |

**Logic ใน `catchError`:**

```
err instanceof TimeoutError?
  ใช่  → แปลงเป็น RequestTimeoutException (HTTP 408) พร้อม message บอกเวลาที่เกิน
  ไม่ใช่ → throwError ส่ง error เดิมต่อไปโดยไม่แตะ (ให้ ExceptionFilter จัดการ)
```

เหตุที่ต้องแปลง `TimeoutError` → `RequestTimeoutException` คือ `TimeoutError` เป็น error ของ RxJS ซึ่ง NestJS ไม่รู้จัก — ถ้าไม่แปลง client จะได้รับ HTTP 500 แทนที่จะเป็น 408 ที่มีความหมายถูกต้อง

#### ตัวอย่างการใช้งาน

**Global (timeout เดียวทั้งแอป):**

```typescript
// app.module.ts
{
  provide: APP_INTERCEPTOR,
  useClass: TimeoutInterceptor,  // ใช้ default 5,000ms
}
```

**Per-route (timeout ต่างกันตาม endpoint):**

```typescript
// ใช้ @UseInterceptors กับ Controller หรือ method เฉพาะ
@UseInterceptors(new TimeoutInterceptor(30000))  // 30 วินาที สำหรับ endpoint ที่ใช้เวลานาน
@Post('export')
exportReport() { ... }
```

#### ตัวอย่าง Response เมื่อ timeout

```json
{
  "success": false,
  "statusCode": 408,
  "message": "Request timed out after 5000ms"
}
```

---

### วิธีใช้งาน Interceptor แบบ Global

มีสองวิธีในการลงทะเบียน Interceptor แบบ Global ซึ่งแตกต่างกันที่ **Dependency Injection**

---

#### วิธีที่ 1: ลงทะเบียนใน `main.ts` ด้วย `useGlobalInterceptors()`

วิธีนี้ง่ายและรวดเร็ว แต่ **ไม่รองรับ Dependency Injection** — Interceptor จะไม่สามารถ inject service อื่นได้ เหมาะสำหรับ Interceptor ที่ไม่ต้องพึ่งพา dependency ใดๆ

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ลงทะเบียน interceptor หลายตัวพร้อมกันได้ ทำงานตามลำดับที่ใส่
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformResponseInterceptor(),
  );

  await app.listen(3000);
}
bootstrap();
```

> **ข้อควรระวัง:** `new LoggingInterceptor()` สร้าง instance เองโดยตรง ทำให้ NestJS DI container ไม่รับรู้ — ถ้า Interceptor ต้องการ inject service ใดก็ตาม จะ error

---

#### วิธีที่ 2: ลงทะเบียนใน `app.module.ts` ด้วย `APP_INTERCEPTOR` (แนะนำ)

วิธีนี้ใช้ระบบ DI ของ NestJS อย่างเต็มที่ ทำให้ Interceptor **สามารถ inject service อื่นได้** และยังคง scope เป็น Global เหมือนเดิม

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

@Module({
  providers: [
    // ลงทะเบียน LoggingInterceptor เป็น Global ผ่าน DI
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // ลงทะเบียน TransformResponseInterceptor เป็น Global ผ่าน DI
    // ทำงานหลัง LoggingInterceptor (ลำดับตาม array)
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
```

> **ทำไมถึงแนะนำวิธีนี้?** เพราะ NestJS จะ instantiate Interceptor ให้เองและสามารถ inject dependency ผ่าน constructor ได้ตามปกติ — เหมือนกับ Service ทั่วไป

---

#### สรุปความแตกต่าง

| | `main.ts` (`useGlobalInterceptors`) | `app.module.ts` (`APP_INTERCEPTOR`) |
|---|---|---|
| Dependency Injection | ไม่รองรับ | รองรับเต็มที่ |
| ความยุ่งยาก | ง่าย | ปานกลาง |
| เหมาะกับ | Interceptor ไม่มี dependency | Interceptor ที่ต้องการ inject service |
| ลำดับการทำงาน | ตามลำดับใน array | ตามลำดับใน `providers` |

---
