## 9. การใช้งาน Prisma แบบครบวงจรในโปรเจกต์ NestJS

Prisma คือเครื่องมือ ORM (Object-Relational Mapping) ที่จะมาทำหน้าที่ในส่วนของ **Repository Layer** แทนที่เราจะเขียนคำสั่ง SQL ดิบๆ (`SELECT * FROM users`) Prisma จะให้เราเขียนเป็นโค้ด JavaScript/TypeScript สะอาดๆ (`prisma.user.findMany()`) แทน

### 📦 ก่อนเริ่มใช้งาน Prisma ต้องจัดการเรื่องติดตั้งอะไรบ้าง?

ปกติแล้วเวลาเราเริ่มต้นโปรเจกต์ NestJS ขึ้นมาใหม่ มันจะยังไม่รู้จัก Prisma เราจึงต้องทำการติดตั้งแพ็กเกจที่จำเป็นลงไปก่อน ตามลำดับนี้:

1. **ติดตั้ง Prisma CLI (เครื่องมือพิมพ์คำสั่งจัดการ Database)**
   เปิด Terminal แล้วพิมพ์รัน:
   ```bash
   npm install prisma --save-dev
   ```
   *(หมายเหตุ: ติดตั้งเป็น `--save-dev` เพราะตัวนี้เอาไว้ให้เราพิมพ์คำสั่งสร้างนู่นนี่ตอนพัฒนาโค้ดเท่านั้น)*

2. **ติดตั้ง Prisma Client (เครื่องมือสำหรับเขียนโค้ดต่อกับ Database ประจำโปรเจกต์)**
   พิมพ์รัน:
   ```bash
   npm install @prisma/client
   ```
   *(หมายเหตุ: ตัวนี้ต้องติดลง Dependency ปกติ เพราะระบบต้องเอามันไปรันใช้งานจริงบนเซิร์ฟเวอร์ด้วย)*

3. **สั่งเปิดใช้งาน Prisma ในโปรเจกต์ (Initialize)**
   พอโหลดแพ็กเกจ 2 ตัวบนเสร็จแล้ว ให้รันคำสั่งนี้ต่อเพื่อสร้างหน้ากระดาษเปล่าๆ เริ่มทำงาน:
   ```bash
   npx prisma init
   ```
   เมื่อรันเสร็จปุ๊บ มันจะสร้างโฟลเดอร์ `prisma` (มาพร้อมไฟล์ `schema.prisma`) และไฟล์ `.env` ขึ้นมาให้เราเตรียมพร้อมตั้งค่าเชื่อมต่อฐานข้อมูลได้ทันที

---

### ไฟล์ของ Prisma มีอะไรบ้าง และอยู่ที่ไหน?

**1. `prisma/schema.prisma`** (หัวใจหลักของ Prisma)
- **หน้าที่:** เป็นไฟล์สำหรับกำหนดว่าจะต่อ Database อะไร (เช่น PostgreSQL, MySQL, SQLite) และ **ออกแบบตารางข้อมูลลงในนี้ทั้งหมด** (Models)
- **ตัวอย่าง:**
  ```prisma
  generator client {
    provider = "prisma-client-js"
  }
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  model Customer {
    id    Int     @id @default(autoincrement())
    name  String
    email String  @unique
  }
  ```

**2. `.env`** (อยู่โฟลเดอร์ Root นอกสุด, ระดับเดียวกับ package.json)
- **หน้าที่:** เก็บค่า Configuration ที่เป็นความลับ เช่น รหัสผ่าน หรือ URL ของ Database (`DATABASE_URL`) ห้ามเอาขึ้น Git เด็ดขาด หากไฟล์นี้ไม่มีอยู่ ต้องสร้างขึ้นมาเอง
- **ตัวอย่าง:**
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/my_database_name"
  ```

**3. โฟลเดอร์ `prisma/migrations/`**
- **หน้าที่:** เก็บประวัติการเปลี่ยนแปลงโครงสร้างฐานข้อมูล (Database Schema History) โฟลเดอร์นี้จะประกอบไปด้วยไฟล์ SQL (`migration.sql`) ที่บอกว่าเรามีการสร้างตารางใหม่ หรือเพิ่มคอลัมน์ไปบ้าง โฟลเดอร์นี้จะถูกสร้างและอัปเดตอัตโนมัติเมื่อเรารันคำสั่ง `migrate`

**4. `src/prisma/prisma.service.ts`** (ไฟล์นี้เราต้องสร้างขึ้นมาเองในโครงสร้าง NestJS)
- **หน้าที่:** เป็นตัวสร้างสะพานเชื่อมระหว่าง NestJS กับ Prisma Client เพื่อให้ไฟล์อื่นๆ (พวก Service หรือ Repository ของเรา) สามารถดึง Prisma ไปใช้ Query ข้อมูลได้
- **ตัวอย่างแบบง่ายๆ:**
  ```typescript
  import { Injectable, OnModuleInit } from '@nestjs/common';
  import { PrismaClient } from '@prisma/client';

  @Injectable()
  export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
      await this.$connect(); // สั่งเชื่อมต่อ DB ตอนรันเซิร์ฟเวอร์
    }
  }
  ```

**5. การเรียกใช้ Prisma ใน Repository หรือ Service** (`src/modules/.../*.repository.ts`)
- **หน้าที่:** เมื่อมี `PrismaService` แล้ว เราก็จะเอามันมา Inject ใช้ใน Repository หรือ Service เพื่อทำงานกับข้อมูลจริงๆ
- **ตัวอย่าง:**
  ```typescript
  import { Injectable } from '@nestjs/common';
  import { PrismaService } from '../../prisma/prisma.service';

  @Injectable()
  export class CustomerRepository {
    constructor(private prisma: PrismaService) {}

    async findAllCustomers() {
      // ใช้ Prisma ดึงข้อมูลลูกค้าทั้งหมด
      return this.prisma.customer.findMany(); 
    }
  }
  ```

---

### Command (คำสั่ง) ของ Prisma ที่ใช้บ่อยตอนใช้งานจริง

#### **ช่วงออกแบบ / แก้ไขตาราง (Schema)**
1. **`npx prisma migrate dev --name <ชื่อการเปลี่ยนแปลง>`**
   - **ใช้ตอนไหน:** ใช้เมื่อมีการเข้าไป **เพิ่ม/ลด/แก้ไข ตารางใน `schema.prisma`** แล้วอยากให้ Database จริงๆ เปลี่ยนแปลงตาม
   - **สิ่งที่เกิดขึ้น:** ระบบจะนำโครงสร้างไปอัปเดตตารางจริง (ในฐานข้อมูล), สร้างโฟลเดอร์ `prisma/migrations` เก็บไฟล์ SQL ประวัติไว้, และอัปเดตโค้ดฝั่ง TypeScript (Prisma Client) ให้อัตโนมัติ
   - *หมายเหตุ: หากไม่มีไฟล์ `.env` ที่กำหนด `DATABASE_URL` ไว้ คำสั่งนี้จะ Error ทันที*
   
2. **`npx prisma db push`**
   - **ใช้ตอนไหน:** คล้าย `migrate dev` คือบังคับอัปเดตโครงสร้างตารางจริงใน Database ให้ตรงตาม `schema.prisma` **แต่จะไม่สร้างไฟล์ประวัติ (Migration) เก็บไว้**
   - **เหมาะกับ:** ตอนทดลองทำโปรเจกต์ใหม่ๆ หรือช่วง Prototype ที่แก้โครงสร้างบ่อยๆ และไม่อยากให้มีไฟล์ Migration ขยะรกโฟลเดอร์

3. **`npx prisma generate`**
   - **ใช้ตอนไหน:** ใช้เมื่อมีการติดตั้งแพ็คเกจใหม่, โคลนโปรเจกต์มาจาก GitHub (ซึ่งไม่ได้เอา `node_modules` มาด้วย), หรือเมื่อ Auto-complete ในโค้ดไม่ยอมทำงาน คำสั่งนี้จะบังคับสร้าง Typings ของ TypeScript ให้ใหม่ตาม `schema.prisma` ปัจจุบัน

#### **ช่วงจัดการข้อมูล (Database Management)**
4. **`npx prisma studio`**
   - **ใช้ตอนไหน:** เป็นคำสั่งที่เปิดหน้าเว็บเบราว์เซอร์ (มักจะเป็น `localhost:5555`) ขึ้นมาเป็น UI โปรแกรมจัดการ Database ย่อมๆ ให้คุณเข้าไปดู, เพิ่ม, ลบ, แก้ไข ข้อมูลใน Database ได้โดยตรงเหมือนใช้โปรแกรม Excel สะดวกมากสำหรับการตรวจเช็คข้อมูล

5. **`npx prisma db seed`**
   - **ใช้ตอนไหน:** รันคำสั่งนี้เพื่อนำข้อมูลจำลอง (Mock Data) หรือข้อมูลตั้งต้นใส่เข้าไปใน Database เพื่อให้ระบบพร้อมใช้งาน (เช่น สร้าง Admin ผู้ใช้งานเริ่มต้น หรือข้อมูลสินค้าสมมติ) โดยจะไปอ่านสคริปต์จากไฟล์ `prisma/seed.ts` (ถ้ามีการตั้งค่าและเขียนเตรียมไว้)

---

### ตั้งชื่อ Migration อย่างไรให้ดี?

เมื่อรัน `npx prisma migrate dev` ระบบจะถามว่า:
```
Enter a name for the new migration: »
```

ให้ตั้งชื่อเป็น **snake_case** สั้นๆ สื่อความหมายว่า **เปลี่ยนแปลงอะไรใน Schema**:

| สถานการณ์ | ชื่อที่ควรใช้ |
|---|---|
| Migration ครั้งแรก (สร้างตารางทั้งหมด) | `init` หรือ `create_all_tables` |
| เพิ่มตารางใหม่ | `add_products_table` |
| เพิ่มคอลัมน์ | `add_email_to_customers` |
| ลบคอลัมน์ | `remove_phone_from_employees` |
| เพิ่ม Index | `add_index_on_customer_code` |
| เปลี่ยนชื่อตาราง | `rename_orders_to_transactions` |
| แก้ความสัมพันธ์ | `add_cascade_delete_to_sales_items` |

**หลีกเลี่ยง**ชื่อที่คลุมเครือ เช่น `update`, `fix`, `changes`, `test`

สามารถส่งชื่อไปพร้อมคำสั่งเลย เพื่อข้ามขั้นตอน Prompt:
```bash
npx prisma migrate dev --name add_email_to_customers
```

---

### ควรรัน `migrate dev` บ่อยแค่ไหน?

รัน **ทุกครั้งที่แก้ไข `schema.prisma`** เช่น:
- เพิ่ม/ลบ Model
- เพิ่ม/ลบ/เปลี่ยนชื่อ Column
- เปลี่ยน Type ของ Column
- เพิ่ม Relation หรือ Index

คิดเหมือน Git Commit — **1 การเปลี่ยนแปลงที่สมเหตุสมผล = 1 Migration** ไม่ควรรวมการเปลี่ยนแปลงที่ไม่เกี่ยวกันหลายอย่างไว้ใน Migration เดียว

```bash
# Workflow ที่ถูกต้อง
# 1. แก้ไข schema.prisma
# 2. รัน migrate พร้อมชื่อที่สื่อความหมาย
npx prisma migrate dev --name add_email_to_customers
# 3. Prisma จะ: สร้าง SQL → อัปเดต DB → Regenerate Prisma Client อัตโนมัติ
```

---

### Auto-sync DB Schema ได้ไหม? ต้องรัน migrate เองทุกครั้งเลยหรือ?

Prisma **ตั้งใจออกแบบให้ต้องรัน migrate เอง** เพราะมันปลอดภัยกว่า — ป้องกันการลบหรือเปลี่ยน Column โดยไม่ตั้งใจ

แต่มีตัวเลือกขึ้นอยู่กับสถานการณ์:

| Command | รันเอง? | สร้าง Migration File? | เหมาะกับ |
|---|---|---|---|
| `prisma migrate dev` | ❌ รันเอง | ✅ ใช่ | ทำงานจริง, ทีม |
| `prisma db push` | ❌ รันเอง | ❌ ไม่มี | Prototype คนเดียว |
| `prisma migrate deploy` | ✅ ใส่ใน CI/CD ได้ | — | Production auto-deploy |

สำหรับ **Production** สามารถใส่ `prisma migrate deploy` ใน pipeline (เช่น GitHub Actions) ได้ — มันจะรัน migration อัตโนมัติตอน deploy โดยไม่ถามชื่อ

---

### ทำงานกับทีม — Migration ของฉันกระทบเพื่อนไหม?

Migration file คือ **โค้ดที่ commit ลง Git** เหมือนกันกับไฟล์อื่น Prisma ติดตามว่า migration ไหนรันไปแล้วด้วยตาราง `_prisma_migrations` ใน DB ของแต่ละคน

```
prisma/
  migrations/
    20240101_init/
      migration.sql       ← commit ลง Git
    20240115_add_email/
      migration.sql       ← commit ลง Git
  _prisma_migrations      ← ตารางใน DB บันทึกว่า migration ไหนรันไปแล้ว
```

#### Flow การทำงานกับทีม

```
คุณ (branch: feature/add-email)          เพื่อน (branch: feature/add-phone)
─────────────────────────────────        ──────────────────────────────────
1. แก้ schema.prisma                     1. แก้ schema.prisma
2. npx prisma migrate dev                2. npx prisma migrate dev
   → สร้าง migration file ใน Git           → สร้าง migration file ใน Git
3. git commit + push                     3. git commit + push
4. เปิด PR → merge to main               4. เปิด PR → merge to main
                        ↓
              ทุกคน git pull
              npx prisma migrate dev
              → Prisma ดู _prisma_migrations ว่า migration ไหนยังไม่รัน
              → รันแค่ migration ที่ยังไม่เคยรัน
              → DB ของแต่ละคนอัปเดตตาม
```

**สำคัญ:** แต่ละคนมี **Local DB ของตัวเอง** (Docker container) migration ของคุณไม่ได้ไปแตะ DB ของเพื่อนโดยตรง เพื่อนต้อง `git pull` แล้วรัน `migrate dev` เองถึงจะได้ schema ใหม่

#### กรณีที่อาจเกิด Conflict

ถ้าสองคนแก้ `schema.prisma` ในส่วนเดียวกันคนละ branch → เกิด **Merge conflict ใน schema.prisma** แก้เหมือน conflict ทั่วไป แล้วรัน `migrate dev` ใหม่อีกครั้ง

```
main:    init → add_email
                    ↑
branch-A:           → add_phone_to_customer   ← merge ก่อน
branch-B:           → add_address_to_customer ← merge ทีหลัง (อาจ conflict)
```

#### Best Practice กับทีม

1. **แก้ schema → migrate → commit ไปพร้อมกันเสมอ** ห้าม commit `schema.prisma` โดยไม่มี migration file คู่กัน
2. **pull → migrate dev** ทุกครั้งที่ดึงโค้ดใหม่จาก main
3. **ห้ามแก้ไข migration file ที่ commit ไปแล้ว** ถ้าผิดให้สร้าง migration ใหม่แก้ทับแทน

---
