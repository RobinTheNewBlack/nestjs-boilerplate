## 6. Guards ใน NestJS (ตัวจัดการสิทธิ์การเข้าถึง)

Guard คือ **ทหารยาม** ที่ทำงานหลังจาก Middleware แต่ก่อนที่ Request จะถึง Controller มีหน้าที่ตัดสินใจว่าจะ **อนุญาต (allow)** หรือ **ปฏิเสธ (deny)** การเข้าถึง Route นั้นๆ โดยดูจาก Token, Role, หรือสิทธิ์ต่างๆ

---

### 🛡️ `guards/jwt-auth.guard.ts` (ทหารยามเช็คสิทธิ์)

**หน้าที่:** ปกป้อง API ไม่ให้คนที่ไม่ได้ Login เข้ามาใช้งาน Guard จะชาร์จตัว Request และตรวจเช็คกุญแจ (Token) ก่อนส่งต่อไปยัง Controller

```typescript
// src/common/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // สามารถแทรก Logic เพิ่มเติมตรงนี้ได้
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('กรุณาเข้าสู่ระบบก่อนใช้งาน');
    }
    return user; // เมื่อผ่าน user จะถูกแปะเข้าไปใน req.user อัตโนมัติ
  }
}
```

---

### วิธีใช้งาน Guard

**แบบ Global (ทุก Route)**

```typescript
// src/app.module.ts
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

**แบบ Controller หรือ Route เดี่ยว**

```typescript
// src/modules/user/user.controller.ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) // ป้องกันทุก Route ใน Controller นี้
export class UserController {

  @Get('profile')
  getProfile() { /* ... */ }

  @Get('public-info')
  // ไม่มี Guard → Route นี้เปิดให้ทุกคนเข้าได้
  getPublicInfo() { /* ... */ }
}
```

---
