# NestJS 101: ขั้นตอนการสร้าง API Server ด้วย NestJS

เอกสารชุดนี้ได้ถูกแบ่งออกเป็นหัวข้อย่อยๆ เพื่อให้อ่านและทำความเข้าใจได้ง่ายขึ้น สามารถเลือกอ่านตามหัวข้อที่สนใจได้จากลิงก์ด้านล่างนี้เลยครับ:

## 📚 หัวข้อและเนื้อหา (Agenda)

- [0. ทำไมต้อง NestJS? (เทียบกับ Express เพียวๆ)](./docs/00-why-nestjs.md)
- [1. โครงสร้างพื้นฐานของ NestJS: Module, Controller, Service และ Repository](./docs/01-architecture.md)
- [2. Pipe และการทำ Data Validation (DTO)](./docs/02-validation-and-pipes.md)
- [3. Built-in HTTP Exceptions (ตัวจัดการ Error อัตโนมัติ)](./docs/03-built-in-exceptions.md)
- [4. โครงสร้างและประโยชน์ของโฟลเดอร์ src/common (Shared Toolbox)](./docs/04-common-folder-structure.md)
  - [4.1 Middleware (CorrelationId & Logger)](./docs/05-middleware.md)
  - [4.2 Guards (ตัวจัดการสิทธิ์การเข้าถึง)](./docs/06-guards.md)
  - [4.3 Exception Filter (ตัวจัดการ Error แบบ Global)](./docs/07-filters.md)
  - [4.4 Interceptors (ตัวจัดการ Response แบบ Global)](./docs/08-interceptors.md)
  - [4.5 Rate Limit (ตัวจัดการ Rate Limit)](./docs/09-rate-limiting.md)
  - [4.6 Enums (TypeScript Enum & ศูนย์รวมค่าคงที่)](./docs/10-enums.md)
  - [4.7 Interfaces (กำหนดโครงสร้างข้อมูลร่วมกัน)](./docs/11-interfaces.md)
- [5. การใช้งาน Prisma แบบครบวงจรในโปรเจกต์ NestJS](./docs/20-prisma-setup.md)
- [6. Authentication & Authorization ด้วย Keycloak + JWT](./docs/12-authentication-authorization.md)

---

## 🛠️ วิธีสร้าง NestJS Project ใหม่ตั้งแต่ต้น

### 1. ติดตั้ง NestJS CLI (ครั้งเดียว)

```bash
npm install -g @nestjs/cli
```

ตรวจสอบว่าติดตั้งสำเร็จ:

```bash
nest --version
```

### 2. สร้าง Project ใหม่

```bash
nest new <ชื่อโปรเจกต์>

# ตัวอย่าง
nest new my-first-nestjs
```

> CLI จะถามให้เลือก package manager (`npm` / `yarn` / `pnpm`) — แนะนำให้เลือก **npm**

### 3. เข้าไปยังโฟลเดอร์โปรเจกต์

```bash
cd my-first-nestjs
```

### 4. โครงสร้างไฟล์เริ่มต้นที่ได้

```
my-first-nestjs/
├── src/
│   ├── app.controller.ts       # Controller ตัวอย่าง
│   ├── app.controller.spec.ts  # Unit test ของ Controller
│   ├── app.module.ts           # Root Module
│   ├── app.service.ts          # Service ตัวอย่าง
│   └── main.ts                 # Entry point ของแอป
├── test/
│   └── app.e2e-spec.ts         # End-to-end test
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

### 5. ทดสอบรัน Server ครั้งแรก

```bash
npm run start:dev
```

เปิดเบราว์เซอร์แล้วเข้า `http://localhost:3000` — ถ้าเห็น `Hello World!` แสดงว่าสำเร็จ ✅

### 6. สร้าง Module / Controller / Service ใหม่ (NestJS CLI)

```bash
# สร้าง Module
nest generate module <ชื่อ>
nest g mo <ชื่อ>            # แบบย่อ

# สร้าง Controller
nest generate controller <ชื่อ>
nest g co <ชื่อ>            # แบบย่อ

# สร้าง Service
nest generate service <ชื่อ>
nest g s <ชื่อ>             # แบบย่อ

# สร้าง Resource (Module + Controller + Service + DTO ครบชุดในคำสั่งเดียว)
nest generate resource <ชื่อ>
nest g res <ชื่อ>           # แบบย่อ
```

### 7. ติดตั้ง Library ที่ใช้บ่อยในโปรเจกต์นี้ (Optional)

```bash
# Validation (class-validator + class-transformer)
npm install class-validator class-transformer

# Prisma ORM
npm install prisma @prisma/client
npx prisma init

# Rate Limiting
npm install @nestjs/throttler

# Config Module (จัดการ .env)
npm install @nestjs/config

# JWT & Passport (Authentication)
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
```

---

## 🚀 วิธีรัน Server

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์:

```env
DATABASE_URL="postgresql://admin:Admin@Test1234@localhost:5432/mynestdb?schema=public"
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. เปิด Database ด้วย Docker

```bash
docker compose up -d
```

### 4. รัน Prisma Migration

```bash
# สร้าง migration จาก schema และ apply ลง DB
npx prisma migrate dev

# (ครั้งแรก) หรือถ้าต้องการแค่ push schema โดยไม่สร้างไฟล์ migration
npx prisma db push
```

### 5. เริ่มต้น Server

```bash
# Development mode (แนะนำ) — hot reload อัตโนมัติเมื่อแก้ไขไฟล์
npm run start:dev

# Production mode — ต้อง build ก่อน
npm run build
npm run start:prod
```

Server จะรันที่ `http://localhost:3000`
Base API path: `http://localhost:3000/api/v1`

---

## 📋 คำสั่ง npm ทั้งหมด

### Development

| คำสั่ง                | รายละเอียด                                    |
| --------------------- | --------------------------------------------- |
| `npm run start`       | รัน server แบบปกติ (ไม่มี hot reload)         |
| `npm run start:dev`   | รัน server พร้อม hot reload (แนะนำสำหรับ dev) |
| `npm run start:debug` | รัน server พร้อม hot reload + debug mode      |

### Build & Production

| คำสั่ง               | รายละเอียด                                         |
| -------------------- | -------------------------------------------------- |
| `npm run build`      | Compile TypeScript → JavaScript ลงโฟลเดอร์ `dist/` |
| `npm run start:prod` | รัน server จากไฟล์ที่ build แล้ว (ต้อง build ก่อน) |

### Code Quality

| คำสั่ง           | รายละเอียด                                  |
| ---------------- | ------------------------------------------- |
| `npm run format` | จัดรูปแบบ code ด้วย Prettier (เขียนทับไฟล์) |
| `npm run lint`   | ตรวจสอบและแก้ไข code ด้วย ESLint อัตโนมัติ  |

### Testing

| คำสั่ง               | รายละเอียด                                                |
| -------------------- | --------------------------------------------------------- |
| `npm run test`       | รัน unit tests ทั้งหมด                                    |
| `npm run test:watch` | รัน unit tests พร้อม watch mode (re-run เมื่อไฟล์เปลี่ยน) |
| `npm run test:cov`   | รัน unit tests พร้อมสร้าง coverage report                 |
| `npm run test:debug` | รัน unit tests ใน debug mode                              |
| `npm run test:e2e`   | รัน end-to-end tests                                      |

### Prisma

| คำสั่ง                      | รายละเอียด                                           |
| --------------------------- | ---------------------------------------------------- |
| `npx prisma migrate dev`    | สร้าง migration ใหม่และ apply ลง DB (สำหรับ dev)     |
| `npx prisma migrate deploy` | Apply migrations ที่มีอยู่ลง DB (สำหรับ production)  |
| `npx prisma db push`        | Push schema ไปยัง DB โดยตรง (ไม่สร้างไฟล์ migration) |
| `npx prisma studio`         | เปิด Prisma Studio GUI เพื่อดูและแก้ไขข้อมูลใน DB    |
| `npx prisma generate`       | Regenerate Prisma Client หลังแก้ไข `schema.prisma`   |
| `npx prisma db seed`        | รัน seed script เพื่อเพิ่มข้อมูลตัวอย่างลง DB        |

### Docker

| คำสั่ง                   | รายละเอียด                                      |
| ------------------------ | ----------------------------------------------- |
| `docker compose up -d`   | เปิด PostgreSQL database ใน background          |
| `docker compose down`    | ปิด containers ทั้งหมด                          |
| `docker compose down -v` | ปิด containers และลบ volume (ข้อมูลใน DB จะหาย) |
