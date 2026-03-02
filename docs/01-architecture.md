# 1.โครงสร้างพื้นฐานของ NestJS: Module, Controller, Service และ Repository

NestJS ถูกออกแบบมาเพื่อให้เขียนโค้ดได้อย่างเป็นระเบียบ เป็นสัดส่วน (Modular) และง่ายต่อการดูแลรักษา โครงสร้างจะแบ่งหน้าที่ชัดเจนตามหลักการ Separation of Concerns (SoC) โดยมี 4 ส่วนสำคัญได้แก่:

---

## 1.1 Module
**Module** คือตัวจัดกลุ่มโค้ดที่มีความเกี่ยวข้องกัน (เช่น ฟีเจอร์ของระบบ ให้อยู่ด้วยกันเป็นชิ้นๆ) โดยทุกแอปพลิเคชันใน NestJS จะต้องมีอย่างน้อยหนึ่ง Module (มักจะเรียกว่า Root Module หรือ `AppModule`)

**หน้าที่หลัก:**
- เป็นตัวบอก NestJS ว่าประกอบไปด้วย Controller, Service หรือ Provider อะไรบ้าง
- จัดการ Dependency Injection (DI) ภายในกลุ่มของมัน
- สามารถ Import Module อื่นมาใช้ (เช่น นำเข้า DatabaseModule) หรือ Export Service/Provider เพื่อให้ Module อื่นนำไปใช้ได้

**Decorator ที่ใช้บ่อยใน Module:**
- `@Module()`: เป็นการระบุว่าคลาสนี้คือ Module โดยจะรับ Object ที่มี Properties หลักๆ ดังนี้:
  - `imports`: นำเข้า Module อื่นๆ ที่จำเป็นต้องใช้
  - `controllers`: ประกาศ Controller ทั้งหมดที่อยู่ภายใต้การดูแลของ Module นี้
  - `providers`: ประกาศ Service หรือ Provider อื่นๆ ที่ถูกใช้งานในนี้
  - `exports`: ลิสต์ Provider ที่ยอมให้ Module อื่นๆ ดึงไปใช้ต่อได้

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

## 1.2 Controller
**Controller** คือด่านแรกที่รับการติดต่อหรือ Request ที่ยิงเข้ามาจากฝั่ง Client (เช่น หน้าเว็บ, แอปมือถือ, หรือ Postman)

**หน้าที่หลัก:**
- รับ HTTP Request แจกแจงว่าใครเรียกเข้ามาทางไหน (GET, POST, PUT, DELETE)
- จัดการ Router หรือ Path (เช่น `/customers`) แล้วถึงไปดึงพารามิเตอร์ (Params, Query, Body) ออกมาจาก Request
- ไม่ควรมี Business Logic การคำนวณที่ซับซ้อนในนี้ ให้แค่รับข้อมูลมา แล้วส่งต่อไปให้ Service เป็นคนจัดการ
- ดึงผลลัพธ์จาก Service แล้วส่ง Response กลับไปหา Client

**Decorator ที่ใช้บ่อยใน Controller:**
- `@Controller('path')`: เป็นการระบุว่าคลาสนี้คือ Controller และกำหนด Base Route Path หลัก (เช่น `@Controller('customers')`)
- `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()`: แมป Method หรือ Function ให้เข้ากับ HTTP Methods ชนิดต่างๆ
- `@Body()`: ดึงชุดข้อมูลที่ถูกส่งมาจากฝั่ง Client ผ่าน Request Body
- `@Param('id')`: ดึงค่าตัวแปรจาก URL Parameter (เช่น `/customers/:id`)
- `@Query()`: ดึงพารามิเตอร์ที่ต่อท้าย URL มาด้วย Query String (เช่น `/customers?search=tony`)
- `@Req()`, `@Res()`: (ถ้าจำเป็น) ดึง Request/Response Object แบบดั้งเดิม (Express/Fastify) ออกมาจัดการเอง

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

## 1.3 Provider (เช่น Services, Repositories, Factories, Helpers เป็นต้น)
**Provider** ถือเป็นคอนเซปต์พื้นฐานที่สำคัญมากใน NestJS คลาสหรือคลาสพื้นฐานหลายๆ ตัวใน NestJS เช่น Service, Repository, Factory, หรือ Helper ต่างก็สามารถทำหน้าที่เป็น (Treated as) Provider ได้ทั้งสิ้น

**แนวคิดหลักของ Provider:**
- หัวใจสำคัญคือ **"มันสามารถถูกฉีดเข้าไปเป็น Dependency ได้ (Injected as a dependency)"**
- นั่นหมายความว่า Object หรือคลาสต่างๆ สามารถสร้างความสัมพันธ์โยงใยเข้าหากันได้ และเราสามารถโยนหน้าที่การเชื่อมโยง Object เหล่านี้เข้าด้วยกัน ("Wiring up") ให้เป็นหน้าที่ของระบบรันไทม์ (Runtime system) ของ NestJS เป็นคนจัดการให้แบบอัตโนมัติ (ผ่านกลไกที่เรียกว่า Dependency Injection หรือ DI)

### 💡 เสริมความเข้าใจ: Dependency Injection (DI) คืออะไร?
**Dependency Injection (DI)** คือรูปแบบการเขียนโปรแกรม (Design Pattern) ชนิดหนึ่ง ที่ช่วยแกัปัญหาตอนที่เราต้องการใช้ Class A ภายใน Class B 

*   **แบบเก่า (ไม่มี DI):** ถ้า CustomerController (Class B) อยากเรียกใช้ CustomerService (Class A) ตัว Controller จะต้องเป็นคนสร้าง Service ขึ้นมาเองด้วยคำสั่ง `new CustomerService()` ปัญหาคือถ้า Service ดันต้องไปเรียกใช้ Repository อีก การสร้างมันขึ้นมาก็จะเริ่มยุ่งยากและผูกมัดกันแน่นเกินไป (Tightly Coupled)
*   **แบบใช้ DI ของ NestJS:** ตัวแอปจะบอกว่า *"คุณ Controller ไม่ต้องสร้าง Service ขึ้นมาเองนะ เดี๋ยวมันจะถูกเตรียมไว้ให้ (ผ่านระบบหลังบ้านที่เรียกว่า IoC Container) หน้าที่คุณคือแค่บอกว่าอยากได้ Service ตัวไหน แล้วเดี๋ยวฉันจะเอาไป 'ฉีด' (Inject) ใส่ไว้ใน `constructor()` ให้คุณพร้อมใช้งานเลย"*

**ข้อดีของมันคือ:** โค้ดแต่ละส่วนจะแยกจากกันชัดเจนขึ้น (Loosely Coupled), จัดการทดสอบ (Unit Test) ได้ง่ายขึ้นมาก เพราะสามารถสลับเอาของปลอม (Mock) มาฉีดแทนของจริงได้ง่ายๆ

โดยปกติ Provider จะถูกประกาศบอก NestJS ไว้ด้วย **Decorator `@Injectable()`** เพื่อบอกว่า "คลาสนี้พร้อมถูกนำไปเสียบ (Inject) ใช้งานในคลาสอื่น (เช่น ใน Controller หรือใน Provider อื่นๆ) แล้ว"

**Decorator ที่ใช้บ่อยใน Provider/Service:**
- `@Injectable()`: อนุญาตให้คลาสนี้ทำงานสัมพันธ์กับระบบ Dependency Injection ของ NestJS (ส่งผลให้สามารถใช้ `constructor()` เพื่อโยงตัวแปร/คลาสอื่นมาร่วมใช้งานได้อัตโนมัติ)
- `@Inject('TOKEN_NAME')` (บางกรณี): ใช้ฉีด Provider หรือตัวแปรพิเศษ ที่ไม่ได้เป็น Class มาตรฐานแบบเจาะจง


## 1.3.1 Service
**Service** คือตัวอย่างที่ชัดเจนและถูกใช้งานบ่อยที่สุดของ Provider มีหน้าที่จดการกับลอจิก กฎเกณฑ์การประมวลผล (Business Logic) ของแอปพลิเคชัน แยกออกจาก Controller เพื่อให้โค้ดสะอาด และสามารถเรียกใช้ซ้ำๆ (Reusable) ได้

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

## 1.3.2 Repository
**Repository** คือ เลเยอร์ที่คอยรับผิดชอบเรื่องการเชื่อมต่อและพูดคุยกับฐานข้อมูล (Database) โดยตรง มักจะถูกใช้คู่กับเครื่องมือประเภท ORM ฝั่ง Node.js (เช่น **TypeORM**, **Prisma**, **Sequelize** หรือ **Mongoose** สำหรับ MongoDB)

**หน้าที่หลัก:**
- เป็นที่ห่อหุ้มคำสั่งจัดการและดึงข้อมูลฐานข้อมูล (CRUD: Create, Read, Update, Delete) แบบเจาะจงกับตาราง
- ข้อดีของการแยกออกมาจาก Service คือ หากวันหนึ่งต้องเปลี่ยนตัวแปรฐานข้อมูล หรือเปลี่ยนเครื่องมือ ORM ก็สามารถมาแก้ได้ที่ Repository เพียงอย่างเดียว โดยที่ฝั่ง `Service` (Business Logic) อาจจะไม่ต้องถูกแก้เลย

**Decorator ที่เกี่ยวเนื่องกับ Repository:**
- `@Injectable()`: เนื่องจาก Repository ทั่วไปจะทำหน้าที่เป็น Provider ตัวนึงของระบบ จึงต้องใส่ `@Injectable()` ไว้บนคลาสของ Repository ด้วย
- (และถ้าใช้ร่วมกับ TypeORM) `@InjectRepository(Entity)`: ใช้เพื่อดึง Repository ของตารางนั้นๆ ที่ TypeORM เตรียมไว้ให้ ออกมาเรียกใช้ต่อ

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

## 1.4 Root-Level Files: app.module.ts, app.controller.ts, app.service.ts

เมื่อโปรเจกต์โตขึ้นและแยกฟีเจอร์ต่างๆ ออกไปไว้ใน `src/modules/` หมดแล้ว หน้าที่ของไฟล์ 3 ตัวที่อยู่ระดับ Root จะเปลี่ยนไปจากตอนเริ่มต้นโปรเจกต์ครับ

ลองนึกภาพว่าโปรเจกต์ของคุณคือ **"บริษัท"** — โฟลเดอร์ย่อยๆ ใน `modules/` คือ **"แผนกต่างๆ"** (ฝ่ายขาย, ฝ่ายบุคคล) ส่วนไฟล์ App ทั้ง 3 ตัวคือ **"สำนักงานใหญ่ (Headquarters)"** ครับ

---

### 🏢 app.module.ts — ต้องมีเสมอ (Root Module)

**หน้าที่หลัก:** เป็นจุดเริ่มต้น (Entry Point) เพียงหนึ่งเดียวที่ NestJS จะมองหาตอนเริ่มรันแอปพลิเคชัน ผ่านคำสั่ง `NestFactory.create(AppModule)` ใน `main.ts`

**ทำอะไรบ้าง:** รวบรวมทุก Module ของทุกแผนก, ระบบฐานข้อมูล, ระบบ Config และตั้งค่า Global Guards/Middlewares

> **สรุป:** ถ้าไม่มีตัวนี้ แอปจะรันไม่ขึ้นเลย

**ตัวอย่างโค้ด:**
```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    // Global Config
    ConfigModule.forRoot({ isGlobal: true }),

    // Database
    PrismaModule,

    // Feature Modules
    AuthModule,
    CustomerModule,
    EmployeeModule,
    ProductModule,

    // Health Check
    HealthModule,
  ],
  providers: [
    // Global Guards
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },

    // Global Interceptors
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },

    // Global Filters
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware, LoggerMiddleware)
      .forRoutes('*');
  }
}
```

---

### 🛎️ app.controller.ts — มีหรือไม่มีก็ได้ (Root Controller)

**หน้าที่หลัก:** รับ Request ที่เข้ามาที่ Root URL โดยตรง เช่น `GET http://localhost:3000/`

**ทำอะไรบ้าง (ในโปรเจกต์จริง):** ส่วนใหญ่ใช้ทำ Health Check ง่ายๆ เพื่อให้ระบบ Monitoring (เช่น AWS, Docker) รู้ว่าเซิร์ฟเวอร์ยังทำงานอยู่

> **สรุป:** ไม่มี Business Logic สำคัญใดๆ ถ้าสร้าง `HealthModule` แยกต่างหากแล้ว สามารถลบไฟล์นี้ทิ้งได้เลย

**ตัวอย่างโค้ด:**
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'My API',
      version: '1.0.0',
      status: 'running',
    };
  }
}
```

เปรียบเทียบ Route ของแต่ละ Controller เมื่อโปรเจกต์โตขึ้น:
```
GET /           →  app.controller.ts       ← ลบได้ถ้ามี HealthModule แล้ว
GET /health     →  health.controller.ts    ← ทำหน้าที่แทนได้
GET /customers  →  customer.controller.ts
GET /products   →  product.controller.ts
```

---

### ⚙️ app.service.ts — มีหรือไม่มีก็ได้ (Root Service)

**หน้าที่หลัก:** เขียน Logic พื้นฐานเพื่อส่งข้อมูลให้ `app.controller.ts`

**ทำอะไรบ้าง:** มักจะมีแค่ฟังก์ชัน boilerplate ที่ติดมาตอนสร้างโปรเจกต์ด้วย NestJS CLI

> **สรุป:** เมื่อโปรเจกต์มี Feature Modules ครบแล้ว ไฟล์นี้จะไม่มีประโยชน์ ควรลบทิ้งเพื่อให้โค้ดสะอาดขึ้น

```typescript
@Injectable()
export class AppService {
  // ฟังก์ชัน boilerplate ที่ NestJS CLI สร้างมาให้ตอน nest new project
  // ใน production แทบไม่มีใครใช้ เพราะ business logic ทุกอย่างอยู่ใน feature modules
  getHello(): string {
    return 'Hello World!';
  }
}
```

---

### 📋 สรุป: เก็บหรือลบ?

| File | สถานะ | เหตุผล |
|---|---|---|
| `app.module.ts` | ✅ เก็บเสมอ | Root Module — NestJS ต้องใช้บังคับ |
| `app.controller.ts` | ⚠️ มีหรือไม่มีก็ได้ | ใช้แค่ `GET /` root route หรือลบถ้ามี HealthModule แล้ว |
| `app.service.ts` | ❌ ลบได้เลย | แทบไม่มีประโยชน์ใน production |

**โครงสร้างที่แนะนำสำหรับโปรเจกต์จริง:**
```
src/
├── main.ts                    # Entry point
├── app.module.ts              # ✅ Root Module (ต้องมีเสมอ)
│
├── database/                  # Prisma / TypeORM config
├── common/                    # Global Guards, Filters, Interceptors
├── shared/                    # Cache, Logger, Queue
├── modules/                   # Feature Modules
│   ├── auth/
│   ├── customer/
│   ├── employee/
│   ├── product/
│   └── health/                # ← ทำหน้าที่แทน app.controller ได้
└── jobs/                      # Background jobs
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
