# โครงสร้างพื้นฐานของ NestJS: Module, Controller, Service และ Repository

NestJS ถูกออกแบบมาเพื่อให้เขียนโค้ดได้อย่างเป็นระเบียบ เป็นสัดส่วน (Modular) และง่ายต่อการดูแลรักษา โครงสร้างจะแบ่งหน้าที่ชัดเจนตามหลักการ Separation of Concerns (SoC) โดยมี 4 ส่วนสำคัญได้แก่:

---

## 1. Module
**Module** คือตัวจัดกลุ่มโค้ดที่มีความเกี่ยวข้องกัน (เช่น ฟีเจอร์ของระบบ ให้อยู่ด้วยกันเป็นชิ้นๆ) โดยทุกแอปพลิเคชันใน NestJS จะต้องมีอย่างน้อยหนึ่ง Module (มักจะเรียกว่า Root Module หรือ `AppModule`)

**หน้าที่หลัก:**
- เป็นตัวบอก NestJS ว่าประกอบไปด้วย Controller, Service หรือ Provider อะไรบ้าง
- จัดการ Dependency Injection (DI) ภายในกลุ่มของมัน
- สามารถ Import Module อื่นมาใช้ (เช่น นำเข้า DatabaseModule) หรือ Export Service/Provider เพื่อให้ Module อื่นนำไปใช้ได้

**ตัวอย่างโค้ด:**
```typescript
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [], // นำเข้า Module อื่นๆ ที่ต้องการใช้งานภายใน Module นี้
  controllers: [CustomerController], // ระบุว่ามี Controller อะไรบ้าง
  providers: [CustomerService], // ระบุว่ามี Service (หรือ Logic/Provider อื่นๆ) อะไรบ้าง
  exports: [CustomerService], // (ถ้ามี) อนุญาตให้ Module อื่นสามารถใช้งาน CustomerService ของเราได้
})
export class CustomerModule {}
```

---

## 2. Controller
**Controller** คือด่านแรกที่รับการติดต่อหรือ Request ที่ยิงเข้ามาจากฝั่ง Client (เช่น หน้าเว็บ, แอปมือถือ, หรือ Postman)

**หน้าที่หลัก:**
- รับ HTTP Request แจกแจงว่าใครเรียกเข้ามาทางไหน (GET, POST, PUT, DELETE)
- จัดการ Router หรือ Path (เช่น `/customers`) แล้วถึงไปดึงพารามิเตอร์ (Params, Query, Body) ออกมาจาก Request
- **ไม่ควรมี Business Logic การคำนวณที่ซับซ้อนในนี้** ให้แค่รับข้อมูลมา แล้วส่งต่อไปให้ Service เป็นคนจัดการ
- ดึงผลลัพธ์จาก Service แล้วส่ง Response กลับไปหา Client

**ตัวอย่างโค้ด:**
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customers') // กำหนดให้เข้าถึงด้วย Route Path: /customers
export class CustomerController {
  // นำ (Inject) Service เข้ามาเพื่อให้ Controller สามารถเรียกใช้งานฟังก์ชั่นต่างๆ ได้
  constructor(private readonly customerService: CustomerService) {}

  // --- 📝 C: Create (สร้าง) ---
  @Post() // แมปกับ HTTP POST: /customers
  create(@Body() createCustomerDto: any) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  // --- 📖 R: Read (อ่านทั้งหมด) ---
  @Get() // แมปกับ HTTP GET: /customers
  findAll() {
    return this.customerService.getAllCustomers();
  }

  // --- 📖 R: Read (อ่าน 1 รายการ) ---
  @Get(':id') // แมปกับ HTTP GET: /customers/1
  findOne(@Param('id') id: string) {
    return this.customerService.getCustomerById(Number(id));
  }

  // --- ✏️ U: Update (แก้ไข) ---
  @Put(':id') // แมปกับ HTTP PUT: /customers/1
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customerService.updateCustomer(Number(id), updateCustomerDto);
  }

  // --- 🗑️ D: Delete (ลบ) ---
  @Delete(':id') // แมปกับ HTTP DELETE: /customers/1
  remove(@Param('id') id: string) {
    return this.customerService.deleteCustomer(Number(id));
  }
}
```

---

## 3. Provider (เช่น Services, Repositories, Factories, Helpers เป็นต้น)
**Provider** ถือเป็นคอนเซปต์พื้นฐานที่สำคัญมากใน NestJS คลาสหรือคลาสพื้นฐานหลายๆ ตัวใน NestJS เช่น Service, Repository, Factory, หรือ Helper ต่างก็สามารถทำหน้าที่เป็น (Treated as) Provider ได้ทั้งสิ้น

**แนวคิดหลักของ Provider:**
- หัวใจสำคัญคือ **"มันสามารถถูกฉีดเข้าไปเป็น Dependency ได้ (Injected as a dependency)"**
- นั่นหมายความว่า Object หรือคลาสต่างๆ สามารถสร้างความสัมพันธ์โยงใยเข้าหากันได้ และเราสามารถโยนหน้าที่การเชื่อมโยง Object เหล่านี้เข้าด้วยกัน ("Wiring up") ให้เป็นหน้าที่ของระบบรันไทม์ (Runtime system) ของ NestJS เป็นคนจัดการให้แบบอัตโนมัติ (ผ่านกลไกที่เรียกว่า Dependency Injection หรือ DI)

โดยปกติ Provider จะถูกประกาศบอก NestJS ไว้ด้วย **Decorator `@Injectable()`** เพื่อบอกว่า "คลาสนี้พร้อมถูกนำไปเสียบ (Inject) ใช้งานในคลาสอื่น (เช่น ใน Controller หรือใน Provider อื่นๆ) แล้ว"

> **Service** คือตัวอย่างที่ชัดเจนและถูกใช้งานบ่อยที่สุดของ Provider มีหน้าที่จดการกับลอจิก กฎเกณฑ์การประมวลผล (Business Logic) ของแอปพลิเคชัน แยกออกจาก Controller เพื่อให้โค้ดสะอาด และสามารถเรียกใช้ซ้ำๆ (Reusable) ได้

**ตัวอย่างโค้ด Service (ซึ่งเป็น Provider ชนิดหนึ่ง):**
```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  // Inject Repository เพื่อเรียกใช้การเชื่อมต่อ Database
  constructor(private readonly customerRepository: CustomerRepository) {}

  // --- 📝 C: Create (สร้าง) ---
  async createCustomer(data: any) {
    // สมมติมี Logic เช็คเงื่อนไขตรวจสอบข้อมูลก่อนบันทึก เช่น ต้องมีชื่อ
    if (!data.name) {
      throw new BadRequestException('ชื่อลูกค้าไม่สามารถเป็นค่าว่างได้');
    }
    return await this.customerRepository.saveCustomer(data);
  }

  // --- 📖 R: Read (อ่านทั้งหมด) ---
  async getAllCustomers() {
    // โค้ดสำหรับดึงข้อมูลและปรับแต่งข้อมูล (ถ้ามี) ก่อนส่งต่อ
    return await this.customerRepository.findAll();
  }

  // --- 📖 R: Read (อ่าน 1 รายการ) ---
  async getCustomerById(id: number) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`ไม่พบข้อมูลลูกค้า ID: ${id}`);
    }
    return customer;
  }

  // --- ✏️ U: Update (แก้ไข) ---
  async updateCustomer(id: number, data: any) {
    // โค้ดสำหรับค้นหาข้อมูลเดิมก่อน หากไม่เจอก็จะโยน Error จาก getCustomerById ทันที
    await this.getCustomerById(id); 
    
    // หากมีข้อมูลอยู่แล้ว ก็ทำการส่งไปอัพเดตที่ Repository
    return await this.customerRepository.updateCustomer(id, data);
  }

  // --- 🗑️ D: Delete (ลบ) ---
  async deleteCustomer(id: number) {
    // ตรวจสอบก่อนว่ามีข้อมูลที่จะลบหรือไม่
    const customer = await this.getCustomerById(id);
    
    await this.customerRepository.deleteCustomer(id);
    return { message: 'ลบข้อมูลลูกค้าเรียบร้อยแล้ว', deletedCustomer: customer };
  }
}
```

---

## 4. Repository
**Repository** คือ เลเยอร์ที่คอยรับผิดชอบเรื่องการเชื่อมต่อและพูดคุยกับฐานข้อมูล (Database) โดยตรง มักจะถูกใช้คู่กับเครื่องมือประเภท ORM ฝั่ง Node.js (เช่น **TypeORM**, **Prisma**, **Sequelize** หรือ **Mongoose** สำหรับ MongoDB)

**หน้าที่หลัก:**
- เป็นที่ห่อหุ้มคำสั่งจัดการและดึงข้อมูลฐานข้อมูล (CRUD: Create, Read, Update, Delete) แบบเจาะจงกับตาราง
- ข้อดีของการแยกออกมาจาก Service คือ หากวันหนึ่งต้องเปลี่ยนตัวแปรฐานข้อมูล หรือเปลี่ยนเครื่องมือ ORM ก็สามารถมาแก้ได้ที่ Repository เพียงอย่างเดียว โดยที่ฝั่ง `Service` (Business Logic) อาจจะไม่ต้องถูกแก้เลย

**ตัวอย่างโค้ด (สมมติใช้งาน TypeORM ซึ่งเป็น ORM มาตรฐานที่ NestJS มักใช้ร่วม):**
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer) // Inject ตาราง/Entity Customer 
    private readonly repo: Repository<Customer>,
  ) {}

  // --- 📝 C: Create (สร้าง) ---
  async saveCustomer(data: Partial<Customer>): Promise<Customer> {
    // .create() ของ TypeORM คือการสร้าง instance ของ entity ขึ้นมาก่อน (ยังไม่ลง DB)
    const customer = this.repo.create(data); 
    // ส่วน .save() คือการสั่งเซฟข้อมูลนั้นลง DB จริงๆ
    return this.repo.save(customer);
  }

  // --- 📖 R: Read (อ่านทั้งหมด) ---
  async findAll(): Promise<Customer[]> {
    return this.repo.find();
  }

  // --- 📖 R: Read (อ่าน 1 รายการ) ---
  async findById(id: number): Promise<Customer | null> {
    return this.repo.findOne({ where: { id } });
  }

  // --- ✏️ U: Update (แก้ไข) ---
  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
    // ตัวอย่างของ TypeORM มักจะสั่ง update ก่อน
    await this.repo.update(id, data);
    
    // แล้วค้นหาข้อมูลล่าที่ถูก update สุดส่งกลับไป (ใช้ findOneOrFail ให้มั่นใจว่ามีข้อมูลชัวร์ๆ ตาม type)
    return this.repo.findOneByOrFail({ id }); 
  }

  // --- 🗑️ D: Delete (ลบ) ---
  async deleteCustomer(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
```

---

## 📌 สรุป Flow การทำงานร่วมกันของทั้ง 4 ส่วน
การไหลของข้อมูลเวลามีคนใช้งานแอปพลิเคชันของคุณจะมีลำดับดังนี้:
1. `Client` (ส่ง Request) ➡ **Controller** (รับ Request + ดึงค่า + สั่งงานต่อ)
2. **Controller** ➡ **Service** (ประมวลผล Business Logic เช็คเงื่อนไข)
3. **Service** ➡ **Repository** (ส่งคำสั่งไปจัดการข้อมูลใน DB)
4. **Repository** ➡ `Database` (บันทึก/ดึงข้อมูลเสร็จแล้ว ส่งคืน Repository)
5. `ถอยหลังกลับไปเรื่อยๆ` ➡ **Service** ➡ **Controller** ➡ `Client` (ในรูปแบบ Response / HTML / JSON)

(โดยทั้งหมดถูกห่อหุ้มไว้ให้เห็นง่ายๆ และพร้อมใช้ผ่าน **Module**)

---

## 5. การใช้งาน Prisma แบบครบวงจรในโปรเจกต์ NestJS

Prisma คือเครื่องมือ ORM (Object-Relational Mapping) ที่จะมาทำหน้าที่ในส่วนของ **Repository Layer** แทนที่เราจะเขียนคำสั่ง SQL ดิบๆ (`SELECT * FROM users`) Prisma จะให้เราเขียนเป็นโค้ด JavaScript/TypeScript สะอาดๆ (`prisma.user.findMany()`) แทน

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
