# 12. Authentication & Authorization ด้วย Keycloak + JWT

ในโปรเจกต์นี้ใช้ **Keycloak** เป็น Identity Provider (IdP) ซึ่งจะออก JWT ให้กับผู้ใช้ที่ Login สำเร็จ แล้ว Backend ของเราจะ **ตรวจสอบ Token** นั้นและ **ควบคุมสิทธิ์** ตาม Role ที่อยู่ใน Token โดยไม่ต้องเก็บ Session หรือ Password ไว้ที่ Backend เลย

---

## ภาพรวม: ขั้นตอนการทำงาน (Request Flow)

```
Client ส่ง Request + Bearer Token
         │
         ▼
┌─────────────────────┐
│   ThrottlerGuard    │  ← ตรวจสอบ Rate Limit ก่อนเป็นอันดับแรก
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│    JwtAuthGuard     │  ← Route นี้เป็น @Public() ไหม?
│                     │     ใช่  → ผ่านเลย ✓
│                     │     ไม่ใช่ → ส่ง Token ให้ JwtStrategy ตรวจสอบ
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│    JwtStrategy      │  ← ดึง Public Key จาก Keycloak (JWKS)
│                     │     ตรวจ Signature, Issuer, Audience, Expiry
│                     │     ถ้าผ่าน → สร้าง user object แล้วเก็บใน req.user
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│     RolesGuard      │  ← Route นี้มี @Roles() ไหม?
│                     │     ไม่มี → ผ่านเลย ✓
│                     │     มี   → เช็ค req.user.roles ว่ามี Role ที่กำหนดไหม
└─────────────────────┘
         │
         ▼
    Controller Method  ← ถึงจะได้รัน!
```

---

## ไฟล์ที่เกี่ยวข้องทั้งหมด

```
src/
├── modules/auth/
│   ├── auth.module.ts        ← ลงทะเบียน Passport + JwtStrategy
│   └── jwt.strategy.ts       ← Logic การตรวจสอบ JWT จาก Keycloak
│
├── common/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts ← Guard ตรวจสอบว่า Login แล้วหรือยัง
│   │   └── roles.guard.ts    ← Guard ตรวจสอบว่ามีสิทธิ์พอไหม
│   │
│   └── decorators/
│       ├── public.decorator.ts       ← @Public() ข้าม Auth ได้เลย
│       ├── roles.decorator.ts        ← @Roles() กำหนด Role ที่ต้องการ
│       └── current-user.decorator.ts ← @CurrentUser() ดึงข้อมูล User
│
└── app.module.ts  ← ลงทะเบียน Guards ทั้งหมดแบบ Global
```

---

## อธิบายแต่ละไฟล์

---

### 1. `modules/auth/auth.module.ts`

**หน้าที่:** โมดูลที่รวบรวมทุกอย่างที่เกี่ยวกับ Auth ไว้ด้วยกัน และ Export `PassportModule` ให้ Module อื่นใช้ได้

```typescript
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
```

- `PassportModule.register({ defaultStrategy: 'jwt' })` → บอกว่า Strategy หลักที่ใช้คือ `jwt`
- `providers: [JwtStrategy]` → ลงทะเบียน JwtStrategy ให้ NestJS รู้จัก
- `exports: [PassportModule]` → ให้ Module อื่นที่ Import AuthModule สามารถใช้ Passport ได้

---

### 2. `modules/auth/jwt.strategy.ts`

**หน้าที่:** กำหนดวิธีที่ Passport ใช้ตรวจสอบ JWT และแปลง Payload เป็น User Object

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const authServerUrl = process.env.KEYCLOAK_AUTH_SERVER_URL;
    const realm = process.env.KEYCLOAK_REALM;

    super({
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: `${authServerUrl}/realms/${realm}/protocol/openid-connect/certs`,
        cache: true,
        rateLimit: true,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `${authServerUrl}/realms/${realm}`,
      audience: process.env.KEYCLOAK_CLIENT_ID,
      algorithms: ['RS256'],
    });
  }

  validate(payload: Record<string, any>) {
    return {
      sub: payload.sub,
      email: payload.email,
      username: payload.preferred_username,
      roles: (payload.realm_access?.roles ?? []) as string[],
    };
  }
}
```

**ขั้นตอนที่ Strategy ทำ:**

| ขั้นตอน | รายละเอียด |
|---------|-----------|
| 1. ดึง Token | `ExtractJwt.fromAuthHeaderAsBearerToken()` — ดึง Token จาก Header `Authorization: Bearer <token>` |
| 2. หา Public Key | `passportJwtSecret` + `jwksUri` — ไปขอ Public Key จาก Keycloak อัตโนมัติ (และ cache ไว้) |
| 3. ตรวจ Signature | ใช้ Public Key ตรวจว่า Token ถูก Sign โดย Keycloak จริงๆ ไม่ได้ถูกปลอมแปลง |
| 4. ตรวจ Claims | เช็ค `issuer`, `audience`, และ `exp` (หมดอายุหรือยัง) |
| 5. เรียก `validate()` | ถ้าผ่านทุกอย่าง → แปลง Payload เป็น User Object แล้วเก็บใน `req.user` |

**ผลลัพธ์ที่ได้ใน `req.user`:**
```typescript
{
  sub: "b0b2d1d9-aa41-4ee0-af47-97b52d869046",  // Keycloak User ID
  email: "nattakit@mail.com",
  username: "nattakit",
  roles: ["offline_access", "default-roles-nest-app", "admin"]
}
```

> **หมายเหตุ:** `jwks-rsa` คือ Library ที่ช่วยดึง Public Key จาก Keycloak โดยอัตโนมัติผ่าน JWKS endpoint (`/protocol/openid-connect/certs`) ทำให้ไม่ต้อง Copy Public Key มาเก็บไว้เองใน Backend

---

### 3. `common/guards/jwt-auth.guard.ts`

**หน้าที่:** ทหารยามด่านแรก ทำหน้าที่กรอง Request ก่อนว่าต้องตรวจ Token ไหม

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```

**Logic การทำงาน:**

```
Request เข้ามา
    │
    ▼
Route มี @Public() ไหม?  (อ่านจาก Reflector/Metadata)
    │
    ├─ ใช่ → return true ทันที (ไม่ตรวจ Token)
    │
    └─ ไม่ใช่ → เรียก super.canActivate()
                    │
                    └─ Passport ไปรัน JwtStrategy
                           ├─ Token ถูกต้อง → req.user ถูกเซ็ต → ผ่าน ✓
                           └─ Token ผิด/หมดอายุ → 401 Unauthorized ✗
```

- `Reflector` คือตัวอ่าน Metadata ที่ถูกแปะไว้บน Route/Controller ด้วย Decorator
- `getAllAndOverride` → อ่าน Metadata โดย Handler (method) มีความสำคัญกว่า Class (controller)

---

### 4. `common/guards/roles.guard.ts`

**หน้าที่:** ทหารยามด่านที่สอง ตรวจสอบว่า User มี Role ที่ Route นั้นกำหนดไว้หรือไม่

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
```

**Logic การทำงาน:**

```
Route มี @Roles(...) ไหม?
    │
    ├─ ไม่มี → return true ทันที (ไม่บังคับ Role)
    │
    └─ มี → ดึง req.user.roles แล้วเช็คว่ามี Role ที่กำหนดอยู่ไหม
               │
               ├─ มีอย่างน้อย 1 Role ที่ตรง → ผ่าน ✓
               └─ ไม่มีเลย → 403 Forbidden ✗
```

> **สังเกต:** `requiredRoles.some(...)` หมายความว่า User ต้องมี **อย่างน้อย 1 Role** จากที่กำหนดไว้ เช่น `@Roles('admin', 'manager')` → มี `admin` หรือ `manager` อย่างใดอย่างหนึ่งก็ผ่าน

---

### 5. `common/decorators/public.decorator.ts`

**หน้าที่:** Decorator สำหรับทำเครื่องหมาย Route ว่าไม่ต้องตรวจสอบ Token

```typescript
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

- `SetMetadata` → แปะ Metadata บน Route/Controller (เหมือนติด Tag ไว้)
- `JwtAuthGuard` จะมาอ่าน Metadata นี้ผ่าน `Reflector` เพื่อตัดสินใจว่าจะข้ามการตรวจ Token หรือไม่

**ตัวอย่างการใช้:**
```typescript
@Public()
@Get('health')
health() {
  return { status: 'ok' };
}
```

---

### 6. `common/decorators/roles.decorator.ts`

**หน้าที่:** Decorator สำหรับกำหนดว่า Route นั้นต้องการ Role อะไรบ้าง

```typescript
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

- `SetMetadata(ROLES_KEY, roles)` → แปะ Role ที่กำหนดไว้เป็น Metadata บน Route
- `RolesGuard` จะมาอ่าน Metadata นี้ผ่าน `Reflector` แล้วเอาไปเปรียบเทียบกับ `req.user.roles`

**ตัวอย่างการใช้:**
```typescript
@Roles('admin')           // ต้องมี Role 'admin' เท่านั้น
@Roles('admin', 'manager') // มี 'admin' หรือ 'manager' อย่างใดอย่างหนึ่งก็พอ
```

---

### 7. `common/decorators/current-user.decorator.ts`

**หน้าที่:** Param Decorator สำหรับดึง User Object จาก `req.user` มาใส่ใน Parameter ของ Controller Method โดยตรง

```typescript
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

- ทำงานหลังจาก `JwtAuthGuard` และ `JwtStrategy` เซ็ต `req.user` แล้ว
- เป็นแค่ Shortcut เพื่อให้ Code ใน Controller สะอาดขึ้น ไม่ได้เพิ่ม Security ใดๆ

**เปรียบเทียบ:**
```typescript
// แบบไม่มี @CurrentUser()
@Get('profile')
getProfile(@Req() req: Request) {
  const user = req.user; // ต้องดึงเองจาก req
  return user;
}

// แบบมี @CurrentUser()
@Get('profile')
getProfile(@CurrentUser() user) { // ได้ user มาตรงๆ เลย
  return user;
}
```

---

### 8. `app.module.ts` — การลงทะเบียน Guards แบบ Global

Guards ทั้งหมดถูกลงทะเบียนด้วย `APP_GUARD` ใน `app.module.ts` ทำให้ทำงานกับ **ทุก Route** โดยอัตโนมัติ โดยไม่ต้องใส่ `@UseGuards()` ที่แต่ละ Controller เอง

```typescript
providers: [
  // ลำดับที่ 1: Rate Limiting
  { provide: APP_GUARD, useClass: ThrottlerGuard },

  // ลำดับที่ 2: ตรวจสอบ JWT Token (Authentication)
  { provide: APP_GUARD, useClass: JwtAuthGuard },

  // ลำดับที่ 3: ตรวจสอบ Role (Authorization)
  { provide: APP_GUARD, useClass: RolesGuard },
]
```

> **สำคัญ:** ลำดับของ `APP_GUARD` มีความหมาย — NestJS รัน Guard ตามลำดับที่ลงทะเบียน ดังนั้น `JwtAuthGuard` ต้องมาก่อน `RolesGuard` เสมอ เพราะ `RolesGuard` ต้องการ `req.user` ที่ `JwtAuthGuard` เป็นคนสร้างให้

---

## สรุปความสัมพันธ์ระหว่างไฟล์

```
app.module.ts
  └── ลงทะเบียน JwtAuthGuard และ RolesGuard แบบ Global

JwtAuthGuard
  ├── อ่าน @Public() metadata ผ่าน Reflector
  └── ถ้าไม่ Public → เรียก JwtStrategy

JwtStrategy
  ├── ดึง Public Key จาก Keycloak JWKS
  ├── ตรวจสอบ Token ทุกด้าน
  └── คืนค่า { sub, email, username, roles } → เก็บใน req.user

RolesGuard
  ├── อ่าน @Roles() metadata ผ่าน Reflector
  └── เปรียบเทียบกับ req.user.roles

@Public()        → แปะ metadata 'isPublic: true' บน Route
@Roles(...)      → แปะ metadata 'roles: [...]' บน Route
@CurrentUser()   → ดึง req.user มาใส่ใน Parameter
```

---

## ตัวอย่างการใช้งานใน Controller

```typescript
import { CurrentUser, Roles, Public } from '@/common/decorators';

@Controller('customers')
export class CustomerController {

  // ทุกคนเข้าได้ ไม่ต้อง Token
  @Public()
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  // ต้อง Login แล้ว (มี Token) แต่ไม่บังคับ Role
  @Get('profile')
  getProfile(@CurrentUser() user) {
    return user; // { sub, email, username, roles }
  }

  // ต้องมี Role 'admin' หรือ 'manager'
  @Roles('admin', 'manager')
  @Get()
  findAll(@CurrentUser() user) {
    console.log(`${user.username} กำลังดึงข้อมูลลูกค้า`);
    return this.customerService.getAllCustomers();
  }

  // ต้องมี Role 'admin' เท่านั้น
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user) {
    console.log(`${user.username} กำลังลบลูกค้า ${id}`);
    return this.customerService.deleteCustomer(id);
  }
}
```

---

## Environment Variables ที่เกี่ยวข้อง

| Variable | ค่าตัวอย่าง | ใช้ทำอะไร |
|----------|-----------|-----------|
| `KEYCLOAK_AUTH_SERVER_URL` | `http://localhost:8080` | URL ของ Keycloak Server |
| `KEYCLOAK_REALM` | `nest-app` | ชื่อ Realm ใน Keycloak |
| `KEYCLOAK_CLIENT_ID` | `nest-app-backend` | Client ID ของ Backend (ใช้ตรวจ `aud` claim) |

---

## Token Claims ที่ Backend ใช้

| Claim | ค่าตัวอย่าง | Backend ใช้ทำอะไร |
|-------|-----------|-----------------|
| `iss` | `http://localhost:8080/realms/nest-app` | ตรวจว่า Token ออกโดย Keycloak Realm ของเรา |
| `aud` | `["nest-app-backend", "account"]` | ตรวจว่า Token นี้ตั้งใจส่งให้ Backend ของเรา |
| `exp` | `1772718629` | ตรวจว่า Token ยังไม่หมดอายุ |
| `sub` | `b0b2d1d9-...` | Keycloak User ID (unique identifier) |
| `preferred_username` | `nattakit` | Username ที่แสดงใน Log |
| `realm_access.roles` | `["admin", "manager"]` | Roles ที่ใช้ใน `RolesGuard` |
