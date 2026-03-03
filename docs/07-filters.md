## 7. Exception Filters ใน NestJS

**Exception Filter** คือตัวดักจับ Error ที่เกิดขึ้นในระบบ เพื่อนำมาจัด Format ให้เป็นรูปแบบมาตรฐานเดียวกันก่อนส่งกลับไปยัง Client

---

### ภาพรวม Filter ทั้งหมด

```
Request → Controller/Service → Exception thrown
                                      ↓
                         ┌────────────────────────┐
                         │   HttpExceptionFilter   │ ← HttpException (400, 401, 404 ...)
                         ├────────────────────────┤
                         │  PrismaExceptionFilter  │ ← Prisma DB errors (P2002, P2025 ...)
                         ├────────────────────────┤
                         │   AllExceptionsFilter   │ ← ทุก Error ที่ไม่มีใครจับ (fallback)
                         └────────────────────────┘
                                      ↓
                              JSON Error Response
```

NestJS รัน Filter จาก **ล่างขึ้นบน** (specific → broad) ดังนั้น Filter ที่ลงทะเบียนทีหลังจะรันก่อน

---

### Response Format มาตรฐาน

ทุก Filter ใช้รูปแบบ Response เดียวกัน:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "คำอธิบาย error",
  "errors": [                      // optional — มีเฉพาะ validation error
    { "field": "email", "message": "must be an email" }
  ]
}
```

---

### 1. `HttpExceptionFilter`

**ไฟล์:** `src/common/filters/http-exception.filter.ts`

**จับ:** `HttpException` และ subclass ทั้งหมด (`BadRequestException`, `NotFoundException`, `UnauthorizedException` ฯลฯ)

**หน้าที่:** แปลง HttpException ให้เป็น JSON response มาตรฐาน รวมถึงดึง `errors` array จาก `ValidationPipe` มาแสดงด้วย

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();
        const statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse() as HttpExceptionResponse;

        const errors: ErrorField[] | undefined = exceptionResponse.errors;

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
```

**ตัวอย่าง Response:**

```json
// NotFoundException
{
  "success": false,
  "statusCode": 404,
  "message": "Customer not found"
}

// ValidationPipe error
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "must be an email" },
    { "field": "name", "message": "must not be empty" }
  ]
}
```

---

### 2. `PrismaExceptionFilter`

**ไฟล์:** `src/common/filters/prisma-exception.filter.ts`

**จับ:** `PrismaClientKnownRequestError`, `PrismaClientValidationError`

**หน้าที่:** แปลง Prisma error code ให้เป็น HTTP status ที่มีความหมาย แทนที่จะปล่อยให้กลายเป็น 500 ทั้งหมด

```typescript
@Catch(PrismaClientKnownRequestError, PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError | PrismaClientValidationError, host: ArgumentsHost) {
        // ...
    }
}
```

**ตาราง Prisma Error Code:**

| Code | ความหมาย | HTTP Status | Message ตัวอย่าง |
|------|-----------|-------------|-----------------|
| `P2002` | Unique constraint violation | `409 Conflict` | `"email already exists"` |
| `P2025` | Record not found | `404 Not Found` | `"Record not found"` |
| `P2003` | Foreign key constraint failed | `400 Bad Request` | `"Related record not found"` |
| `P2000` | Value too long for column | `400 Bad Request` | `"Input value is too long"` |
| `PrismaClientValidationError` | Query shape ผิด | `400 Bad Request` | `"Invalid data provided"` |

**ตัวอย่าง Response:**

```json
// P2002 — duplicate email
{
  "success": false,
  "statusCode": 409,
  "message": "email already exists"
}

// P2025 — update/delete record that doesn't exist
{
  "success": false,
  "statusCode": 404,
  "message": "Record not found"
}
```

---

### 3. `AllExceptionsFilter`

**ไฟล์:** `src/common/filters/all-exceptions.filter.ts`

**จับ:** ทุก Exception (`@Catch()` ไม่ระบุ type = จับทุกอย่าง)

**หน้าที่:** เป็น **fallback สุดท้าย** สำหรับ error ที่ไม่มี Filter อื่นจับ เช่น database connection crash, null reference error, หรือ bug ที่ไม่คาดคิด — จะ return `500 Internal Server Error` เสมอ แต่ถ้าเป็น `HttpException` ก็ยังสามารถดึง status และ message ที่ถูกต้องออกมาได้

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            // ยังคง handle HttpException ได้ถ้า Filter อื่นไม่จับ
            statusCode = exception.getStatus();
            // ...
        }

        response.status(statusCode).json({
            success: false,
            statusCode,
            message,
            ...(errors && errors.length > 0 && { errors }),
        });
    }
}
```

**ตัวอย่าง Response:**

```json
// Unknown runtime error / crash
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

### การลงทะเบียน Filter แบบ Global ใน `app.module.ts`

ใช้ `APP_FILTER` จาก `@nestjs/core` เพื่อลงทะเบียน Filter แบบ Global ผ่าน Dependency Injection (แนะนำกว่า `useGlobalFilters` ใน `main.ts` เพราะรองรับ DI)

```typescript
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  providers: [
    // ลงทะเบียน Filter จาก broad → specific
    // NestJS รัน Filter ที่ลงทะเบียนทีหลังก่อน (last-in, first-run)
    { provide: APP_FILTER, useClass: AllExceptionsFilter },    // fallback (รันสุดท้าย)
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },  // Prisma errors
    { provide: APP_FILTER, useClass: HttpExceptionFilter },    // HTTP errors (รันก่อน)
  ],
})
export class AppModule {}
```

> **หมายเหตุ:** NestJS ใช้หลัก **last-in, first-run** สำหรับ `APP_FILTER` ดังนั้นต้องลงทะเบียน `AllExceptionsFilter` ก่อนเสมอ เพื่อให้มันทำงานเป็น fallback สุดท้าย

---

### เปรียบเทียบ `APP_FILTER` vs `useGlobalFilters`

| | `APP_FILTER` (app.module.ts) | `useGlobalFilters` (main.ts) |
|---|---|---|
| Dependency Injection | รองรับ | ไม่รองรับ |
| ตำแหน่ง | `providers` array | `main.ts` bootstrap |
| แนะนำ | ✅ ใช่ | ใช้เมื่อ filter ไม่ต้องการ DI |
