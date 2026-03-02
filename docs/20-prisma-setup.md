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
