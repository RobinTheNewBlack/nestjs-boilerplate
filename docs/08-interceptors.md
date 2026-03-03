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
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('Interceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    // ==========================================
    // ➡️ โซนขาเข้า (ทำงานก่อนเข้า Controller)
    // ==========================================
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const startTime = Date.now(); // เริ่มจับเวลา

    this.logger.log(`[ขาเข้า] Request กำลังจะเข้า Controller: ${method} ${url}`);

    // ==========================================
    // 🚧 เส้นแบ่งเขต (เรียก Controller ให้ทำงาน)
    // ==========================================
    return next.handle().pipe(

      // ==========================================
      // ⬅️ โซนขาออก (ทำงานหลังจาก Controller รีเทิร์นค่ากลับมา)
      // ==========================================
      tap((data) => {
        // ตัวแปร data ตรงนี้คือสิ่งที่คุณ return ออกมาจาก Controller
        const duration = Date.now() - startTime;

        this.logger.log(`[ขาออก] Controller ทำงานเสร็จแล้ว! ใช้เวลาไป: ${duration}ms`);
        // tap จะไม่ดัดแปลง data มันแค่แอบดูแล้วปล่อย data ส่งกลับไปหา Client ตามปกติ
      }),
    );
  }
}
```

---

### 🎁 `interceptors/transform-response.interceptor.ts` (ทำงานขาออก)

**หน้าที่:** ตัวจัดรูปแบบ Response โดยดักจับค่าที่ Controller ส่งกลับมา เพื่อนำมาจัดรูปแบบใหม่ให้เป็นมาตรฐานเดียวกันก่อนส่งกลับไปยัง Client — ทำงานเฉพาะ **ขาออก** ผ่าน `map`

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

### วิธีใช้งาน Interceptor แบบ Global

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformResponseInterceptor());

  await app.listen(3000);
}
bootstrap();
```

---
