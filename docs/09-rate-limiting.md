## 8. การทำ Rate Limit ด้วย Throttler Module

การทำ Rate Limit เพื่อป้องกันการโจมตีแบบ Brute Force, DDoS, หรือลดปัญหาสแปม Request (เช่น SMS Bombing) ใน NestJS เราสามารถใช้ `@nestjs/throttler` ได้

### 1. ลงทะเบียนใน `app.module.ts` (Global Level)
การลงทะเบียนตรงนี้สามารถกำหนดลิมิตไว้ได้หลายระดับ และถ้าเรา Inject `APP_GUARD` เข้าไปด้วย มันจะถูกนำไปปรับใช้กับทุกๆ Route อัตโนมัติ

```typescript
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',       // ป้องกัน burst request
        ttl: 1000,           // 1 วินาที
        limit: 3,            // สูงสุด 3 requests ต่อวินาที
      },
      {
        name: 'medium',      // ป้องกัน abuse ระดับปานกลาง
        ttl: 10000,          // 10 วินาที
        limit: 20,           // สูงสุด 20 requests ต่อ 10 วินาที
      },
      {
        name: 'long',        // ป้องกัน abuse ระยะยาว
        ttl: 60000,          // 1 นาที
        limit: 100,          // สูงสุด 100 requests ต่อนาที
      },
    ]),
  ],
  providers: [
    // ✅ Apply ทุก route อัตโนมัติ
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### 2. Custom ต่อ Route (Controller Level)
หากบาง API เราไม่ได้อยากให้โดน Rate Limit เข้มงวดเท่ากันหมด (เช่น การ Login ควรจะจำกัดการรัวซ้ำๆ ส่วนหน้าแรกของเว็บอาจจะไม่ต้องขี้งกขนาดนั้น) เราสามารถใช้ Decorator อย่าง `@Throttle()` เพื่อเขียนทับเงื่อนไขบาง Endpoint ได้ หรือใช้ `@SkipThrottle()` เพื่อปล่อยผ่านได้

```typescript
import { Controller, Post, Get, Body } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {

  // ✅ Login เข้มงวดกว่าปกติ — กัน brute force
  @Throttle([
    { name: 'short', limit: 1, ttl: 1000 },     // 1 req/วินาที
    { name: 'medium', limit: 5, ttl: 60000 },    // 5 req/นาที
    { name: 'long', limit: 10, ttl: 3600000 },   // 10 req/ชั่วโมง
  ])
  @Post('login')
  login(@Body() dto: any) {}

  // ✅ OTP ยิ่งเข้มงวด — กัน SMS bombing
  @Throttle([
    { name: 'short', limit: 1, ttl: 30000 },     // 1 req / 30 วินาที
    { name: 'long', limit: 5, ttl: 3600000 },    // 5 req / ชั่วโมง
  ])
  @Post('send-otp')
  sendOtp(@Body() dto: any) {}
}

@Controller('products')
export class ProductController {

  // ✅ GET ทั่วไป — ปล่อยผ่านไม่ต้อง limit
  @SkipThrottle()
  @Get()
  findAll() {}
}
```

### 3. Response เมื่อถูก Rate Limit

ถ้าหาก User ยิง Request เกินกว่าจำนวนที่ `limit` กำหนดไว้ตาม `ttl` ตัว NestJS จะดีดกลับด้วย HTTP Status Code 429 แบบนี้ทันที:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

พร้อมกับแนบ Headers กลับไป เพื่อให้ฝั่ง Frontend หรือ Client นำไปใช้งานต่อได้:
- `X-RateLimit-Limit`: 100 (จำนวนโควต้าสูงสุด)
- `X-RateLimit-Remaining`: 0 (โควต้าที่เหลืออยู่ตอนนี้)
- `X-RateLimit-Reset`: 1709380000 (เวลาที่ก้อน TTL นี้จะถูกรีเซ็ตใหม่ ในรูปแบบ Unix Timestamp)
- `Retry-After`: 45 (ต้องรออีกกี่วินาที ถึงจะยิง Request ใหม่เข้ามาได้ โดยไม่โดนบล็อก)

---