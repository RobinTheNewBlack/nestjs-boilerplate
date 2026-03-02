## 5. Middleware ใน NestJS (CorrelationId & Logger)

Middleware คือ **ด่านแรกสุด** ที่รับ Request ก่อนที่จะถูกส่งต่อไปยัง Guard หรือ Controller ทำงานในระดับ Express.js จึงสามารถดัดแปลง `req`, `res` หรือเรียก `next()` ได้โดยตรง

---

### 🔗 `middleware/correlation-id.middleware.ts` (ตัวสร้าง Tracking ID)

**หน้าที่:** เปรียบเสมือนการแปะ "บัตรคิว" หรือ "Tracking Number" ไปกับทุก Request ช่วยให้เวลาเราค้นประวัติ Log บน Production สามารถแกะรอยการทำงานของ Request นั้นๆ ได้ตั้งแต่ต้นจนจบ

```typescript
// src/common/middleware/correlation-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. ตรวจสอบ Header เผื่อมี Correlation ID แนบมาจาก Service อื่น
    const correlationHeader = req.headers['x-correlation-id'];

    // 2. ถ้าไม่มี ให้สุ่ม UUID ใหม่
    const correlationId = correlationHeader || randomUUID();

    // 3. ฝังลงใน Request เพื่อให้ส่วนอื่นของระบบดึงไปใช้ (เช่น ไปใส่ใน Log)
    req['correlationId'] = correlationId;

    // (ทางเลือก) แนบกลับไปใน Response ด้วย
    res.setHeader('x-correlation-id', correlationId);

    // 4. ไปยังด่านต่อไป
    next();
  }
}
```

---

### 📝 `middleware/logger.middleware.ts` (นักจดบันทึกการเข้า-ออก)

**หน้าที่:** ดักจับและจดบันทึกข้อมูลทุกๆ Request ที่วิ่งเข้ามา และ Response ที่ถูกส่งกลับออกไป มีประโยชน์มากในการใช้เฝ้าระวังระบบ (Monitoring) ทำให้เรารู้ว่าใครเรียก API ไหนบ้าง ใช้เวลาประมวลผลไปกี่มิลลิวินาที (ms) และผลลัพธ์คือสำเร็จหรือพัง

```typescript
// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    // สร้างตัวแปร logger โดยระบุ Context ว่า 'HTTP' เพื่อให้จัดกลุ่ม Log ได้ง่าย
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        // 1. เก็บข้อมูลตอนที่ Request เพิ่งเข้ามาถึง
        const { method, originalUrl, ip } = req;
        const userAgent = req.get('user-agent') || '';
        const startTime = Date.now(); // จับเวลาเริ่มต้น

        // 2. ดักจับ Event 'finish' ซึ่งจะทำงานเมื่อ Response ถูกส่งกลับไปหา Client เสร็จสิ้นแล้ว
        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length') || 0;
            const responseTime = Date.now() - startTime; // คำนวณเวลาที่ใช้ไปทั้งหมด

            // ดึง Correlation ID ที่ได้จาก correlation-id.middleware.ts (ถ้ามี)
            const correlationId = req['correlationId'] || '-';

            // 3. พิมพ์ Log ออกมาทาง Console หรือส่งเข้าไฟล์
            // รูปแบบ: [CorrelationID] GET /api/v1/users 200 120b - PostmanRuntime/7.29.2 ::1 - 15ms
            this.logger.log(
                `[${correlationId}] ${method} ${originalUrl} ${statusCode} ${contentLength}b - ${userAgent} ${ip} - ${responseTime}ms`
            );
        });

        // 4. ให้ระบบทำงานต่อไป (วิ่งเข้าหา Controller)
        next();
    }
}
```

---

### 💡 3 รูปแบบการเรียกใช้งาน Middleware ใน NestJS

แม้ว่า `LoggerMiddleware` หรือ `CorrelationIdMiddleware` จะถูกเก็บไว้ใน `/common` แต่เวลาเอาไปใช้งานจริง เราสามารถเลือกระดับความครอบคลุม (Scope) ของ Middleware ได้ 3 รูปแบบ ดังนี้:

**1. แบบ Global (ทำทุก Route ทั้งแอป)**

เหมาะกับ Middleware อย่าง Logger หรือ Correlation ID ที่เราอยากดักทุกๆ Request ในระบบ การติดตั้งแบบนี้จะต้องไปลงทะเบียนที่ `app.module.ts`:

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [ /* ... */ ],
})
export class AppModule implements NestModule {
  // ลงทะเบียน Middleware ของเราตรงนี้
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware, LoggerMiddleware)
      .forRoutes('*'); // 💡 '*' แปลว่าให้ทำงานกับทุกๆ Route ในแอป
  }
}
```

**2. แบบเฉพาะ Module (Feature-Level)**

สมมติว่าคุณมี `AuditMiddleware` ที่อยากให้ทำงานเฉพาะเวลาที่เรียกใช้งาน API ของโมดูลจัดการการซื้อขาย (Sales Transaction) เพื่อบันทึกประวัติ คุณไม่ต้องใส่ที่ `app.module.ts` ทั่วไปทั้งแอป แต่ให้ไปใส่ใน Module นั้นๆ แทน:

```typescript
// src/modules/sales-transaction/sales-transaction.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { SalesTransactionController } from './sales-transaction.controller';
import { AuditMiddleware } from '@/common/middleware/audit.middleware';

@Module({
  controllers: [SalesTransactionController],
})
export class SalesTransactionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuditMiddleware) // เรียกใช้แค่ตัวนี้
      .forRoutes(SalesTransactionController); // 💡 ให้ทำงานเฉพาะทุก Route ใน Controller นี้เท่านั้น
  }
}
```

**3. แบบเฉพาะระบุ Path หรือ HTTP Method (Route-Level)**

ถ้าอยากให้ทำงานแคบลงไปอีก เช่น ตรวจสอบไฟล์อัปโหลดเฉพาะจังหวะ `POST /products` แต่ไม่ทำตอน `GET` ให้ตั้งค่าระบุ Path และ Method เข้าไปตรงๆ ได้เลย:

```typescript
// src/modules/product/product.module.ts
import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ProductController } from './product.controller';
import { UploadCheckMiddleware } from '@/common/middleware/upload-check.middleware';

@Module({
  controllers: [ProductController],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadCheckMiddleware)
      .forRoutes({ path: 'products', method: RequestMethod.POST }); // 💡 เจาะจง Method และ Path
  }
}
```

> 💡 **เกร็ดความรู้เพิ่มเติม: การใช้ `app.use()` ใน `main.ts`**
>
> บางครั้งคุณอาจไปเจอโค้ดตามอินเทอร์เน็ตที่มีการใช้ `app.use()` ในไฟล์ `main.ts` เพื่อเรียกใช้งาน Middleware:
> ```typescript
> // src/main.ts
> async function bootstrap() {
>   const app = await NestFactory.create(AppModule);
>
>   // เรียกใช้ Functional Middleware
>   app.use(helmet());
>   app.use(cookieParser());
>
>   await app.listen(3000);
> }
> ```
> ข้อแตกต่างคือ: `app.use()` ใน `main.ts` จะรับได้เฉพาะ **Functional Middleware (ฟังก์ชันธรรมดา)** เท่านั้นครับ จะเอา **Class Middleware** ของ NestJS (ที่มี Dependency Injection หรือ constructor คอยฉีด Service เช่น `constructor(private logger: Logger)`) มาใส่ไม่ได้เด็ดขาด Class Middleware แบบที่เราเขียนขึ้นมาเองจะต้องนำไปลงทะเบียนผ่าน `configure(consumer)` ในระดับ Module (แบบ 3 ข้อด้านบน) เสมอครับ!

---
