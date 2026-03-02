# NestJS 101: ขั้นตอนการสร้าง API Server ด้วย NestJS

# 0.ทำไมต้อง NestJS? (เทียบกับ Express เพียวๆ)

ก่อนจะเจาะลึกโครงสร้าง เรามาทำความเข้าใจก่อนว่าทำไมหลายๆ คน (รวมถึงบริษัทยักษ์ใหญ่) ถึงเลือกใช้ **NestJS** ทั้งๆ ที่แค่ใช้ **Express.js** อย่างเดียวก็เปิด API Server ได้แล้ว

ต้องบอกก่อนว่า **NestJS ไม่ได้เกิดมาฆ่า Express, แต่เกิดมา "ขี่" Express (หรือ Fastify) อีกที** เพื่อแก้ปัญหาเรื่อง "การไม่มีกฎระเบียบที่จับต้องได้" ของ Express

### 📌 อาการปวดหัวของคนที่ใช้ Express สคริปต์เพียวๆ (Pain Points)
Express.js เป็นเว็บเฟรมเวิร์กที่ยืดหยุ่นมาก (Unopinionated) มันให้อิสระคนเขียนโค้ด 100% ว่าจะจัดโครงสร้างไฟล์ยังไง วางโฟลเดอร์ไว้ไหน ซึ่งในโปรเจกต์ขนาดเล็กมันดีมากเพราะเริ่มต้นได้ไวปานสายฟ้าแลบ 
แต่นั่นคือ "ดาบสองคม" หากโปรเจกต์คุณเริ่มมีขนาดใหญ่ (Enterprise scale) หรือมีทีมใหญ่มาทำร่วมกัน:
- โค้ดแต่ละคนเขียนมาสไตล์ไม่เหมือนกัน
- ไฟล์ Controller ยาวเหยียดปะปนกับ Database Query จนอ่านไม่ออก (Spaghetti Code)
- ทะเลาะกันเรื่องการตั้งชื่อโฟลเดอร์ และวิธีแยก Component
- ลำบากมากเวลาจะทำ Test แยกชิ้นส่วน

### 🦸‍♂️ ข้อดีของ NestJS (ทำไมถึงเป็นตัวช่วยชีวิต)
NestJS เข้ามาในฐานะเฟรมเวิร์กที่มี "ความเห็นเป็นของตัวเองสูง" (Opinionated) คือบังคับให้ทุกคนเขียนในสไตล์เดียวกันทั้งหมด (คล้ายๆ กฎระเบียบโรงเรียน):
1. **โครงสร้างสไตล์ Angular บนโลก Backend:** ใครย้ายมาจาก Angular นี่แทบพิมพ์ไหลลื่น มันบังคับให้แยกส่วนเป็น Module, Controller, Service อย่างชัดเจน 
2. **ใช้ TypeScript เป็นหัวใจหลัก (First-class citizen):** ช่วยเขียนโค้ดได้ปลอดภัย (Type-safe), มี Auto-complete ที่ชาญฉลาดลดโอกาสเกิดบั๊กตกหล่นตอนรันโปรแกรม
3. **พ่วงระบบ Dependency Injection (DI) สุดล้ำ:** อันนี้คือทีเด็ด ทำให้คุณไม่จำเป็นต้อง `new Service()` เองพร่ำเพรื่อ การโยงโค้ดเข้าหากัน (wiring) เป็นเรื่องที่สมูทและเป็นอัตโนมัติ 
4. **ทำ Unit Test ได้ง่ายมากๆ:** เพราะมี DI ทำให้เราสามารถเสียบจำลอง (Mock) ข้อมูล Database แทนของจริงตอนเทสต์ระบบได้ง่ายสุดๆ
5. **ของแถมพร้อมใช้เยอะ (Batteries Included):** ไม่ต้องไปนั่งงมหาติดตั้ง Library ควบคุมสิทธิ์ (Gaurd/JWT), ตัวตรวจสอบข้อมูล (Validation Pipe / DTOs), หรือเชื่อมต่อดาต้าเบส (TypeORM/Prisma) ทุกอย่างมีเอกสารสอนแบบ Official ครบวงจร

### ⚖️ ข้อเสียที่เราต้องแลกเมื่อใช้ NestJS
1. **Learning Curve สูงปรี๊ด:** สำหรับคนที่เคยจับแต่ Express เดี่ยวๆ มาเจอ NestJS ช่วงแรกจะเหวอมาก เพราะต้องเรียนรู้คอนเซปต์ใหม่เยอะมาก ทั้ง DI, DTO, Pipes, Guards, Decorators (ซึ่งทั้งหมดนี้คืออิทธิพลจากโลก Java / C# / Angular)
2. **Boilerplate ค่อนข้างเยอะ:** ทำโปรเจกต์ 1 API อาจจะต้องสร้างอย่างน้อยๆ 3-4 ไฟล์ (Controller, Service, Module, DTO) ทำให้บางทีรู้สึกว่า "แค่จะปริ้นท์คำเดียว ทำไมเตรียมตัวเยอะจังวะ" (ไม่เหมาะกับโปรเจกต์สเกลเล็กจิ๋วสุดๆ เท่าไหร่)
3. **Performance รันข้ากว่านิดๆ:** เพราะมันห่อหุ้มคลุม Express อีกชั้นหนึ่ง (แต่ถ้าปรับใช้ Fastify วิ่งข้างใต้แทน Express ก็จะกลายร่างเป็นจรวดทันที)

> **สรุปสั้นๆ:** ถ้าทำโปรเจกต์จบเล็กๆ เล่นๆ ใช้ **Express** ไวกว่าพิมพ์แป๊บเดียวเสร็จ แต่ถ้าจะทำระบบใหญ่อลังการที่ต้องอยู่ยั้งยืนยงให้คนอื่นมารับช่วงต่อได้โดยไม่สาปแช่ง ควรยอมเหนื่อยเรียน **NestJS** ครับ!

---
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

## 📌 สรุป Flow การทำงานร่วมกันของทั้ง 4 ส่วน
การไหลของข้อมูลเวลามีคนใช้งานแอปพลิเคชันของคุณจะมีลำดับดังนี้:
1. `Client` (ส่ง Request) ➡ **Controller** (รับ Request + ดึงค่า + สั่งงานต่อ)
2. **Controller** ➡ **Service** (ประมวลผล Business Logic เช็คเงื่อนไข)
3. **Service** ➡ **Repository** (ส่งคำสั่งไปจัดการข้อมูลใน DB)
4. **Repository** ➡ `Database` (บันทึก/ดึงข้อมูลเสร็จแล้ว ส่งคืน Repository)
5. `ถอยหลังกลับไปเรื่อยๆ` ➡ **Service** ➡ **Controller** ➡ `Client` (ในรูปแบบ Response / HTML / JSON)

(โดยทั้งหมดถูกห่อหุ้มไว้ให้เห็นง่ายๆ และพร้อมใช้ผ่าน **Module**)

---

# 2. Pipe และการทำ Data Validation (DTO)

**Pipe** ใน NestJS คือคลาสที่เข้ามาคั่นกลาง (Intercept) ตอนที่ Client ส่งข้อมูลเข้ามา (Request) ก่อนที่ข้อมูลนั้นจะถูกส่งต่อไปถึง Controller สอดคล้องกับภาพตัวอย่างที่คุณส่งมา Pipes มี 2 หน้าที่หลัก คือ:

1. **Transformation (การแปลงข้อมูล):** แปลงข้อมูลที่รับเข้ามาให้อยู่ในหน้าตา/รูปแบบที่ต้องการ เช่น การรับค่าไอดีทาง URL ซึ่งมาเป็น String (`'1'`) แล้ว Pipe ทำการแปลงให้กลายเป็นตัวเลข Integer (`1`) ให้อัตโนมัติ ก่อนส่งเข้า Controller
2. **Validation (ตรวจสอบความถูกต้อง):** ประเมินข้อมูลที่ได้รับมา หากข้อมูลถูกต้องและตรงข้อกำหนด ก็จะปล่อยผ่าน (Pass through) ให้ทำงานต่อไป แต่ถ้าหากตรวจพบข้อมูลที่ไม่ถูกต้องหรือไม่ตรงตามกำหนด Pipe จะจัดการโยน Exception แย้งขึ้นมา (มักจะเป็น `400 Bad Request`) และตัดจบการทำงานทันที ข้อดีคือทำให้ Controller เราไม่ต้องเขียนโค้ดเช็ค `if(!data) { ... }` ซ้ำซาก

### 🛠️ 2.1 วิธีการใช้งาน Pipe ร่วมกับ DTO (เพื่อทำ Validation)

ในการให้ NestJS ตรวจสอบข้อมูลอัตโนมัติจาก DTO ที่เราพิมพ์ไป เราต้องเปิดใช้งาน `ValidationPipe` (ซึ่งทำงานร่วมกับ `class-validator`) โดยสามารถตั้งค่าได้ 2 ที่หลักๆ ได้แก่:

**1. ระดับ Global (ตรวจสอบทุกๆ Request ทั้งระบบ)**
เหมาะมากสำหรับการใช้งานทั่วไป เปิดใช้งานที่ในไฟล์ `src/main.ts`
```typescript
// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // เสียบ ValidationPipe ไว้ที่ระดับแอปพลิเคชัน
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // หากส่ง field ที่ไม่มีใน DTO เข้ามา ระบบจะทำการตัด field แปลกปลอมทิ้งให้อัตโนมัติ
    forbidNonWhitelisted: true, // หากส่ง field ประหลาดมา ระบบจะเตือนเป็น Error เลย
    transform: true, // เปิดการแปลงประเภทข้อมูลให้อัตโนมัติตาม Type ที่เขียนใน DTO
  }));

  await app.listen(3000);
}
bootstrap();
```

**2. ระดับ Controller หรือ ระดับ Method (เฉพาะจุด)**
ใช้เมื่อต้องการเปิดใช้งาน Pipe แบบเจาะจงเฉพาะบาง Endpoint เท่านั้น
```typescript
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  
  @Post()
  @UsePipes(new ValidationPipe()) // ใส่ควบคุมเฉพาะบน Endpoint นี้เดี่ยวๆ
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }
}
```

### 🏷️ 2.2 Validation Decorator แต่ละตัวคืออะไร?

ในไฟล์จำพวก DTO เราจะนำ Decorators จากไลบรารี `class-validator` มาแปะไว้เหนือกำกับตัวแปรต่างๆ ของเรา ตัวแปรไหนจะโดนประเมินอย่างไรบ้างก็ขึ้นอยู่กับสิ่งที่เราเลือกใช้:

**🌟 ตระกูลตรวจสอบชนิดข้อมูลพื้นฐาน (Type Checkers):**
*   `@IsString()`: ข้อมูลฟิลด์นี้ต้องเป็นตัวอักษรหรือข้อความ (String)
*   `@IsNumber()`: ข้อมูลฟิลด์นี้ต้องเป็นตัวเลขทั่วไป (Number)
*   `@IsInt()`: ต้องเป็นตัวเลข **จำนวนเต็ม** เท่านั้น (Integer) ห้ามมีทศนิยม
*   `@IsBoolean()`: ข้อมูลต้องเป็น True หรือ False (Boolean)
*   `@IsArray()`: ข้อมูลต้องส่งมาเป็นรูปแบบ Array `[...]`
*   `@IsObject()`: ข้อมูลต้องส่งมาเป็นรูปแบบ Object `{...}`
*   `@IsDateString()`: ต้องส่งมาเป็นข้อความรูปแบบวันที่ที่ถูกต้อง เช่น ISO8601 (`"2026-03-01T12:00:00Z"`)

**🛡️ ตระกูลตรวจสอบข้อบังคับ (Modifiers):**
*   `@IsNotEmpty()`: ห้ามเว้นว่าง (ห้ามส่ง `''`, `null` หรือ `undefined`) บังคับว่าผู้ใช้ต้องกรอกและส่งฟิลด์นี้มาแน่ๆ
*   `@IsOptional()`: อนุญาตให้ไม่ต้องกรอกส่งมาก็ได้ (ปล่อยผ่านได้เลยถ้าไม่มีข้อมูล) แต่ถ้าอุตส่าห์ส่งมา ก็จะต้องถูกตรวจสอบด้วย Decorator ตัวถัดๆ ไป

**📏 ตระกูลวัดขนาดความสั้น/ยาว (Length & Size):**
*   `@MinLength(จำนวน)`: ต้องมีความยาวจำนวนตัวอักษรขั้นต่ำ
*   `@MaxLength(จำนวน)`: จะต้องมีความยาวตัวอักษรไม่เกินที่กำหนด
*   `@Min(ค่าต่ำสุด)`: (ใช้กับตัวเลข) ค่าของตัวเลขห้ามต่ำกว่าที่กำหนด
*   `@Max(ค่าสูงสุด)`: (ใช้กับตัวเลข) ค่าของตัวเลขห้ามเกินกว่าที่กำหนด

**🔍 ตระกูลตรวจสอบรูปแบบเจาะจง (Format Checkers):**
*   `@IsEmail()`: ข้อมูลต้องเป็นรูปแบบอีเมลที่ถูกต้อง
*   `@IsUUID()`: ต้องเป็นรหัสรูปแบบ UUID
*   `@IsUrl()`: ต้องเป็นรูปแบบ URL ลิงก์เว็บไซต์ที่ถูกต้อง
*   `@IsPhoneNumber(region)`: ต้องเป็นเบอร์โทรศัพท์ที่ถูกต้อง (เช็กตามรหัสประเทศได้ เช่น `@IsPhoneNumber('TH')`)
*   `@Matches(/regex/)`: ตรวจสอบความถูกต้องโดยใช้ **Regular Expression** (เอาไว้กำหนดเงื่อนไขรหัสผ่านยากๆ ได้ดีมาก เช่น ต้องมีตัวการันต์ ตัวพิมพ์ใหญ่ ตัวเลข บลาๆ)
*   `@IsIn(['admin', 'user'])`: ค่าที่ส่งมาต้อง **ตรงกับ 1 ในตัวเลือก** ที่ระบุไว้ใน Array เท่านั้น (เหมาะสำหรับพวกสถานะ หรือ Role)

> **💡 การตั้งข้อความ Error เอง (Custom Error Message):**
> คุณสามารถส่ง Object ออปชันพิเศษแนบเข้าไปตาม Decorator เพื่อให้ส่งข้อความ Error ที่ต้องการได้ เช่น
> `@MinLength(2, { message: 'First name must be at least 2 characters long' })`

---

### 2.3 Built-in Pipes ทั้ง 9 ตัวใน NestJS และวิธีใช้งาน

NestJS มี Pipes สำเร็จรูปมาให้ 9 ตัวหลักๆ ซึ่งพร้อมใช้งานทันที (Out-of-the-box) มักจะนำมาใช้คู่กับ `@Param()`, `@Query()`, หรือ `@Body()` ใน Controller หน้าที่หลักของพวกนี้คือการ **แปลงข้อมูล (Transform)** และ **ตรวจสอบข้อมูล (Validate)** ว่าเป็นประเภทที่ถูกต้องหรือไม่ก่อนจะทำคำสั่งต่อไป:

1. **`ValidationPipe`**
   - **หน้าที่:** พระเอกหลักในการทำ Validation ใช้คู่กับหน้าฝั่ง DTO และไลบรารี `class-validator` หรือ `class-transformer` เพื่อเช็คกฏเกณฑ์ความถูกต้องของ Object อย่างครบถ้วน
   - **ตัวอย่าง:** 
     ```typescript
     @Post()
     create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) { ... }
     ```

2. **`ParseIntPipe`**
   - **หน้าที่:** แปลงข้อมูล (ที่มักมาเป็น String ผ่าน URL) ให้กลายเป็นตัวเลขจำนวนเต็ม (Integer) ถ้ารับเข้ามาแล้วไม่ใช่ตัวเลข จะโยน Error `400 Bad Request` ทันที
   - **ตัวอย่าง:** 
     ```typescript
     @Get(':id')
     findOne(@Param('id', ParseIntPipe) id: number) { 
       // ตอนนี้เรามั่นใจได้ว่าตัวแปร id เป็นตัวเลขชัวร์ๆ
     }
     ```

3. **`ParseFloatPipe`**
   - **หน้าที่:** แปลงข้อมูลให้กลายเป็นตัวเลขทศนิยม (Float) ถ้าไม่ใช่จะโยน Error 
   - **ตัวอย่าง:** มีประโยชน์เวลาส่งจำนวนเงิน หรือพิกัด
     ```typescript
     @Get()
     findByPrice(@Query('price', ParseFloatPipe) price: number) { ... }
     ```

4. **`ParseBoolPipe`**
   - **หน้าที่:** แปลงข้อมูลเป็น Boolean (`true` / `false`) ถ้าส่งมาเป็น `'true'`, `'1'`, `'false'`, `'0'` มันก็จะแปลงให้ถูกต้องตามตรรกะ
   - **ตัวอย่าง:**
     ```typescript
     @Get()
     getPosts(@Query('isActive', ParseBoolPipe) isActive: boolean) { ... }
     ```

5. **`ParseArrayPipe`**
   - **หน้าที่:** ตรวจสอบและแปลงชุดข้อมูลให้กลายเป็น Array เสมอ สามารถระบุ Type ของข้อมูลใน Array นั้นๆ ต่อได้ด้วย
   - **ตัวอย่าง:** สมมติส่งพารามิเตอร์มาเป็นชุดๆ `?ids=1,2,3`
     ```typescript
     @Get('by-ids')
     findByIds(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]) { ... }
     ```

6. **`ParseUUIDPipe`**
   - **หน้าที่:** ตรวจสอบข้อมูลว่าอยู่ในรูปแบบ UUID หรือไม่ (เช่น ไอดีที่ฐานข้อมูล gen ขึ้นมาแบบสุ่มตัวอักษร) ปกติมีหลายเวอร์ชัน มักจะเช็ค UUID v4 เป็นหลัก 
   - **ตัวอย่าง:**
     ```typescript
     @Get(':uuid')
     findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) { ... }
     ```

7. **`ParseEnumPipe`**
   - **หน้าที่:** ตรวจสอบว่าข้อมูลที่รับมาตรงกับค่าคงที่ใน ENUM (ตัวเลือกที่ฟิกซ์เอาไว้ล่วงหน้า) ชุดใดชุดหนึ่งที่เรากำหนดไว้หรือไม่ หากส่งนอกเหนือจากตัวเลือกไปจะ Error ทันที
   - **ตัวอย่าง:** 
     ```typescript
     enum Role { ADMIN = 'admin', USER = 'user' }
     
     @Get('users')
     findUsers(@Query('role', new ParseEnumPipe(Role)) role: Role) { ... }
     ```

8. **`DefaultValuePipe`**
   - **หน้าที่:** กำหนดค่าเริ่มต้น (Fallback) เอาไว้ในกรณีที่ฝั่ง Client ไม่ได้ส่งพารามิเตอร์นั้นติดมาด้วย ทั่วไปมักใช้คั่นก่อนหน้าที่จะโยนเข้า Pipe อื่นๆ ต่อ 
   - **ตัวอย่าง:** ถ้าไม่ได้ระบุ `age` มา ให้ถือว่าเท่ากับ `18` ก่อนไปแปลงเป็นตัวเลข
     ```typescript
     @Get()
     findAll(@Query('age', new DefaultValuePipe(18), ParseIntPipe) age: number) { ... }
     ```

9. **`ParseFilePipe`**
   - **หน้าที่:** ใช้ตรวจสอบความถูกต้องของการอัปโหลดไฟล์ (File Upload) ตัวนี้สามารถทำหน้าที่ช่วยตรวจสอบขนาดไฟล์สถิติ (Max File Size) หรือรูปแบบของไฟล์ (Mime Type ว่าเป็น jpg/png หรือไม่)
   - **ตัวอย่าง:**
     ```typescript
     @Post('upload')
     @UseInterceptors(FileInterceptor('file'))
     uploadFile(@UploadedFile(
       new ParseFilePipe({
         validators: [
           new MaxFileSizeValidator({ maxSize: 1000 }),
           new FileTypeValidator({ fileType: 'image/jpeg' }),
         ],
       }),
     ) file: Express.Multer.File) { ... }
     ```
     ```

---

### 2.4 การทำ Type / Format Validation ควรทำที่ Layer ไหนใน NestJS?

ในการพัฒนาแอปด้วย NestJS การทำ Type และ Format Validation (เช่น ตรวจสอบชนิดตัวแปรและรูปแบบ) **มักจะทำที่ "หน้าประตูก่อนเข้า Controller Layer"** ผ่านเครื่องมือที่เรียกว่า **Pipes** ครับ

หลักการนี้เรียกว่า **"Fail-Fast"** คือถ้าข้อมูลส่งมาผิดรูปแบบหรือผิดประเภท (เช่น ส่งตัวอักษรขำๆ มาในช่องเบอร์โทรศัพท์ หรือลืมใส่อีเมล) ระบบจะเตะข้อมูลขยะเหล่านั้นทิ้งและตอบกลับด้วย HTTP 400 (Bad Request) ทันที โดยไม่ยอมให้หลุดเข้าไปถึง Service หรือ Database ให้เสียเวลาและเสี่ยงพังครับ

เพื่อความชัดเจน เรามาดูหน้าที่การทำ Validation ของแต่ละ Layer ใน NestJS กัน:

#### 1. 🛡️ Controller Layer (หน้าด่าน: Type & Format Validation)
- **ทำอะไร:** ตรวจสอบรูปแบบ (Format), ชนิดข้อมูล (Type), ความยาว (Length), หรือ Required fields (บังคับกรอก) ว่าตรงตามสเปคโครงสร้างเบื้องต้นไหม
- **เครื่องมือที่ใช้:** `DTOs` (Data Transfer Objects) + `class-validator` + `ValidationPipe`
- **ตัวอย่าง:**
  - "ช่องนี้ต้องเป็นอีเมลที่ถูกต้องเท่านั้นนะ" (`@IsEmail()`)
  - "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" (`@MinLength(8)`)
  - "อายุต้องเป็นตัวเลข" (`@IsInt()`)

#### 2. 🧠 Service Layer (สมอง: Business Logic Validation)
- **ทำอะไร:** ตรวจสอบเงื่อนไขทางธุรกิจ (Business Rules) ซึ่งมักจะต้องดึงเอาข้อมูลเก่าที่มีอยู่มาตัดสินใจร่วมด้วย (ข้อมูลที่หลุดมาถึงชั้นนี้ จะ**ถือว่า Format ถูกต้อง 100% แล้ว** เพราะชั้น Controller กรองมาให้เสร็จสรรพ)
- **เครื่องมือที่ใช้:** โค้ด Logic พื้นฐาน (`if-else`), การเรียกใช้ Repository เพื่อนำข้อมูลมาหาจุดขัดแย้ง
- **ตัวอย่าง:**
  - "อีเมลนี้รูปแบบถูกต้องนะ... แต่มีคนใช้สมัครสมาชิกไปแล้วหรือยังล่ะ?" (ต้อง query DB ดู)
  - "ลูกค้าคนนี้จะซื้อสินค้า แต่ยอดเงินในระบบมีพอให้ตัดไหม?"
  - "สินค้าตัวนี้ สต๊อกหมดแล้วหรือยัง?"

#### 3. 🗄️ Repository / Database Layer (ปราการด่านสุดท้าย: Data Integrity Validation)
- **ทำอะไร:** รักษาความถูกต้อง คงเส้นคงวา และบูรณภาพของข้อมูลในระดับฐานข้อมูล ป้องกันข้อมูลพังหรือขัดแย้งกันในเคสที่โค้ดส่วนอื่นผิดพลาด
- **เครื่องมือที่ใช้:** Prisma Schema (`schema.prisma`) หรือเงื่อนไข (Constraints) ฝั่ง Database 
- **ตัวอย่าง:**
  - การกำหนดฟิลด์ว่าห้ามซ้ำซ้อน (`@unique` ใน Prisma)
  - การทำเงื่อนไขตอนลบข้อมูล (Foreign Key constraints) เช่น ถ้าลบ User นี้ ต้องลบ Post ของเขาทิ้งด้วยไหม
  - การกำหนดค่าเริ่มต้น (Default values) เช่น ถ้าไม่ส่งเวลามา ให้เอาเวลาปัจจุบัน (`@default(now())`)

## 3. Built-in HTTP Exceptions (ตัวจัดการ Error อัตโนมัติ)

NestJS มี standard exceptions ที่สืบทอดมาจาก `HttpException` แบบพร้อมใช้งานทันที (Built-in) ซึ่งถูกรวบรวมไว้ที่แพ็กเกจ `@nestjs/common` ช่วยให้เราโยน (throw) Error กลับไปให้ Client ได้ง่าย เป็นมาตรฐาน และโค้ดอ่านง่ายขึ้น โดยไม่ต้องจำ HTTP Status Code เป็นตัวเลขเองทั้งหมด

### 🛠️ 3.1 วิธีใช้งานเบื้องต้น:
ปกติเรามักจะโยน (throw) Exception เหล่านี้ในชั้น **Service** หรือ **Controller** เมื่อเกิดข้อผิดพลาดตามเงื่อนไข (Business Logic) เมื่อเราสั่ง throw ปุ๊บ การประมวลผลโค้ดบรรทัดต่อๆ ไปจะหยุดทันที แล้ว NestJS จะตีกลับเป็น Response หน้าตามาตรฐานส่งให้ Client อัตโนมัติ

**ตัวอย่างโค้ด:**
```typescript
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.userService.findById(id);
    
    if (!user) {
      // โยน Exception ปุ๊บ โค้ดจะหยุดทำงานและตอบกลับเป็น HTTP 404 ทันที
      throw new NotFoundException(`ไม่พบผู้ใช้งาน ID: ${id}`);
    }
    
    return user;
  }
}
```
*ตัวอย่าง Response ที่ NestJS จะตอบกลับให้แบบอัตโนมัติ:*
```json
{
  "statusCode": 404,
  "message": "ไม่พบผู้ใช้งาน ID: 123",
  "error": "Not Found"
}
```

---

### 📋 3.2 รายการ Built-in HTTP Exceptions ตามที่มีมาให้

1. **`BadRequestException` (HTTP 400)**
   - **คืออะไร / ใช้ตอนไหน:** เมื่อ Client ส่งข้อมูลมาผิดรูปแบบ ผิดเงื่อนไข (มักเจอบ่อยสุดจากการตรวจ Validation)
   - **ตัวอย่าง:** ลืมส่ง Field ที่จำเป็น, ส่งตัวอักษรมาในช่องเบอร์โทร, ข้อมูลไม่ผ่าน `class-validator`

2. **`UnauthorizedException` (HTTP 401)**
   - **คืออะไร / ใช้ตอนไหน:** ล็อกอินไม่ผ่าน หรือ **ยังไม่ระบุตัวตน** (ไม่มี Token / Token หมดอายุ / รหัสผ่านผิด)
   - **ตัวอย่าง:** พยายามเข้าสู่ระบบจัดการหลังบ้าน แต่ไม่ได้แนบ `Authorization Header` มาด้วย

3. **`ForbiddenException` (HTTP 403)**
   - **คืออะไร / ใช้ตอนไหน:** ระบุตัวตนแล้ว (เข้าสู่ระบบแล้ว) แต่ **ไม่มีสิทธิ์ (Permission/Role)** ในการทำแอคชันนั้น
   - **ตัวอย่าง:** User ระดับสมาชิกธรรมดา พยายามทำการลบข้อมูลที่อนุญาตให้เฉพาะ "Admin" ทำได้

4. **`NotFoundException` (HTTP 404)**
   - **คืออะไร / ใช้ตอนไหน:** ค้นหา Resource หรือข้อมูลที่ร้องขอ **ไม่เจอในระบบ** (หรือเรียกเข้า URL ผิด)
   - **ตัวอย่าง:** ค้นหาสินค้า ID 99 แต่สืบค้นใน Database แล้วไม่พบสินค้านี้อยู่

5. **`NotAcceptableException` (HTTP 406)**
   - **คืออะไร / ใช้ตอนไหน:** Server ไม่สามารถตอบข้อมูลกลับเป็น Format ที่ Client เรียกร้องได้ (จาก HTTP Header `Accept`)
   - **ตัวอย่าง:** Client บังคับให้ Server ส่งข้อมูลเป็น XML แต่ API เราเขียนรองรับการส่งออกมารูปแบบเพียวๆ เป็น JSON เท่านั้น

6. **`RequestTimeoutException` (HTTP 408)**
   - **คืออะไร / ใช้ตอนไหน:** เมื่อ Server ใช้เวลาประมวลผลนานเกินไป จนเกินขอบเขตจำกัดเวลา (Timeout)
   - **ตัวอย่าง:** รอการคำนวณข้อมูลใหญ่ๆ หรือรอให้ Database ตอบกลับแบบล่าช้ามากๆ จน Request โดนตัดจบ

7. **`ConflictException` (HTTP 409)**
   - **คืออะไร / ใช้ตอนไหน:** เมื่อข้อมูลที่ส่งมา **ขัดแย้งกับข้อมูลเดิมที่มีอยู่ก่อนหน้าแล้วในระบบ**
   - **ตัวอย่าง:** สมัครสมาชิกใหม่ แต่อีเมลถูกใช้ไปก่อนหน้านี้แล้ว (ซ้ำซ้อน) ซึ่งจะขัดแย้งกับ Database เงื่อนไข Unique

8. **`GoneException` (HTTP 410)**
   - **คืออะไร / ใช้ตอนไหน:** Resource ที่เรียกหานี้เคยมีอยู่แต่ **ถูกลบทิ้งหรือเลิกให้บริการไปอย่างถาวร** (ต่างจาก 404 ตรงนี้)
   - **ตัวอย่าง:** ยิงต่อเข้าไปที่ API Endpoint เวอร์ชันเก่าที่มีประกาศว่าเลิกใช้ (Deprecated) และถอดออกไปแล้ว

9. **`PayloadTooLargeException` (HTTP 413)**
   - **คืออะไร / ใช้ตอนไหน:** เมื่อ Request Body หรือไฟล์ขนาด **ใหญ่เกินกว่าที่เซิร์ฟเวอร์ตั้งค่า Limit ไว้**
   - **ตัวอย่าง:** ผู้ใช้อัปโหลดวิดีโอขนาด 500MB แต่เซิร์ฟเวอร์ตั้ง `Max file size` รับได้สูงสุดแค่ 50MB

10. **`UnsupportedMediaTypeException` (HTTP 415)**
    - **คืออะไร / ใช้ตอนไหน:** ฝั่ง Client แนบไฟล์/ข้อมูลมาในฟอร์แมตที่เซิร์ฟเวอร์ **ไม่รองรับ** (จาก `Content-Type`)
    - **ตัวอย่าง:** เซิร์ฟเวอร์เตรียมรับเฉพาะรูปภาพ `.png` หรือ `.jpeg` แต่ผู้ใช้ส่งไฟล์เอกสาร `.pdf` มาให้แทน

11. **`UnprocessableEntityException` (HTTP 422)**
    - **คืออะไร / ใช้ตอนไหน:** ข้อมูลส่งมาถูก Format ถูกโครงสร้าง แต่เซิร์ฟเวอร์ดันเจอ **ข้อผิดพลาดเชิงลอจิกเฉพาะตัว (Semantic error)**
    - **ตัวอย่าง:** ไฟล์ภาพที่ส่งมาเป็นนามสกุล `.jpg` จริงอ่านออก แต่อัตราส่วนภาพกว้างคูณยาวไม่เป็นจัตุรัสตามที่ระบบต้องการ หรือส่งรหัสอ้างอิงของไฟล์เสียงที่ไม่ใช่ตามรูปแบบที่กำหนดไว้

12. **`InternalServerErrorException` (HTTP 500)**
    - **คืออะไร / ใช้ตอนไหน:** เจอ **ข้อผิดพลาดรุนแรงฝั่ง Server** ส่วนมากเกิดจากโค้ดพัง หรือเจอข้อผิดพลาดที่ไม่มีคนดักตีวง (Catch) ไว้
    - **ตัวอย่าง:** ตัวแปรเป็น Undefined แต่ไปสั่งตีดอทเรียกค่าต่อ `.map()`, หรือเซิร์ฟเวอร์ Database หลักทำร่วงดับกลางอากาศ

13. **`NotImplementedException` (HTTP 501)**
    - **คืออะไร / ใช้ตอนไหน:** เมื่อฝั่ง Server **ยังไม่ได้สร้างฟีเจอร์หรือ Method ที่ถูกร้องขอมารองรับ (โค้ดยังเขียนไม่เสร็จ)**
    - **ตัวอย่าง:** ประกาศ API เผื่อไว้ให้ระบบหน้าบ้านก่อนว่าจะมี แต่ฝั่ง Backend ดักรีเทิร์น Error เบรกบอกว่า "เดี๋ยวค่อยทำ ตอนนี้ให้ตายไปก่อน"

14. **`HttpVersionNotSupportedException` (HTTP 505)**
    - **คืออะไร / ใช้ตอนไหน:** เมื่อ Protocol HTTP Version ของ Client เก่าหรือประหลาดเกินไป จนต้อนรับทำงานด้วยกันไม่ได้ (พบเจอน้อยมาก)
    - **ตัวอย่าง:** Web Server ปรับแต่งตั้งค่าให้รองรับ HTTP/2.0 ขึ้นไปเท่านั้น แต่ดันมี Client เครื่องรุ่นเก่ายิงต่อด้วย HTTP/1.0

---

## 4. โครงสร้างและประโยชน์ของโฟลเดอร์ `src/common` (Shared Toolbox)

โฟลเดอร์ `/common` เปรียบเสมือน **"กล่องเครื่องมือส่วนกลาง"** ของโปรเจกต์ โค้ดใดๆ ก็ตามที่ถูกเรียกใช้งานซ้ำๆ จากหลายๆ Module (เช่น `UserModule`, `ProductModule`) จะถูกนำมารวมไว้ที่นี่ เพื่อให้ง่ายต่อการเรียกใช้ ไม่ซ้ำซ้อน (ตามหลัก DRY - Don't Repeat Yourself) และช่วยสร้างมาตรฐานเดียวกันทั้งแอปพลิเคชัน

### 📂 ภาพรวมโฟลเดอร์ย่อยใน `/common`

- **`constants/`**: เก็บตัวแปรค่าคงที่ (Constant Variables) เช่น ชื่อ HTTP Headers, ตัวเลข Configuration
- **`decorators/`**: เก็บ Custom Decorator ที่สร้างขึ้นมาใช้เอง (เช่น `@CurrentUser()`)
- **`enums/`**: เก็บ TypeScript Enums เพื่อใช้กำหนดชุดค่าคงที่ที่มีข้อจำกัด (เช่น สถานะการชำระเงิน `PaymentStatus`)
- **`filters/`**: เก็บ Exception Filters สำหรับดักจับ Error และจัดรูปแบบ Error Message ให้เป็นมาตรฐานก่อนส่งกลับไปที่ Frontend
- **`guards/`**: เก็บ Guards ที่ทำหน้าที่เหมือนทหารยาม คอยเช็คสิทธิ์ (เช่น ตรวจสอบ JWT Token หรือเช็ค Role)
- **`interceptors/`**: เก็บ Interceptors สำหรับดักจับ Request ขาเข้า หรือจัดรูปแบบ Response ขาออก (เช่น ห่อข้อมูลด้วย `{ success: true, data: ... }`)
- **`interfaces/`**: กำหนดโครงสร้างข้อมูล (Type/Interface) ที่ใช้ร่วมกัน
- **`middleware/`**: ด่านแรกสุดที่รับ Request (ระดับ Express.js) เช่น Middleware สำหรับจัดการ Request ID
- **`utils/`**: เก็บฟังก์ชันตัวช่วย (Helper functions) ทั่วไป เช่น ฟังก์ชันสุ่มรหัสผ่าน, ตัวช่วยคำนวณวันหมดอายุ

---

### 🕵️‍♂️ 4.1 เจาะลึกไฟล์สำคัญใน `/common` พร้อมตัวอย่างโค้ด

#### 1. 🛡️ `guards/jwt-auth.guard.ts` (ทหารยามเช็คสิทธิ์)
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

#### 2. 🧹 `filters/http-exception.filter.ts` (แผนกจัดรูปแบบ Error)
**หน้าที่:** ดักจับ Error ที่เกิดขึ้นในระบบแล้วจัด Format ให้เป็นรูปแบบ (`JSON`) แบบเดียวกันทั้งหมด ทำให้ Frontend นำไปแสดงผลหรือจัดการต่อได้ง่าย

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // จัด Format Error ให้ดูเป็นระดับมืออาชีพ
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: request['correlationId'], // ดึง Correlation ID มาตรวจสอบได้เลย
      message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message,
    });
  }
}
```

#### 3. 🎁 `interceptors/transform-response.interceptor.ts` (ตัวจัดรูปแบบ Response)
**หน้าที่:** ดักจับค่าที่ Controller ส่งกลับมา เพื่อนำมาจัดรูปแบบใหม่อีกครั้งให้เป็นมาตรฐานเดียวกันก่อนส่งกลับไปยัง Client

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

#### 4. 🔗 `middleware/correlation-id.middleware.ts` (ตัวสร้าง Tracking ID)
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

#### 5. 📝 `middleware/logger.middleware.ts` (นักจดบันทึกการเข้า-ออก)
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

#### 💡 3 รูปแบบการเรียกใช้งาน Middleware ใน NestJS

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

ถ้าอยากให้ทำงานแคปแคบลงไปอีก เช่น ตรวจสอบไฟล์อัปโหลดเฉพาะจังหวะ `POST /products` แต่ไม่ทำตอน `GET` ให้ตั้งค่าระบุ Path และ Method เข้าไปตรงๆ ได้เลย:

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

#### 6. 🏷️ `enums/payment-status.enum.ts` (ศูนย์รวมค่าคงที่)
**หน้าที่:** กำหนดค่าที่เป็นไปได้ทั้งหมดให้กับตัวแปรหนึ่งๆ ป้องกันความผิดพลาดจากการพิมพ์ (Typo Error)

```typescript
// src/common/enums/payment-status.enum.ts
export enum PaymentStatus {
  PENDING = 'PENDING',       // รอดำเนินการ
  PROCESSING = 'PROCESSING', // กำลังประมวลผล
  SUCCESS = 'SUCCESS',       // สำเร็จ
  FAILED = 'FAILED',         // ล้มเหลว
  REFUNDED = 'REFUNDED'      // คืนเงินแล้ว
}
```

สรุปคือ โฟลเดอร์ `/common` เป็นพื้นที่ที่จะช่วยให้โค้ดของคุณ **มีมาตรฐานเดียวกันหมด** หากมีเครื่องมือส่วนกลางที่สร้างขึ้นมาอย่างดี จะช่วยให้ทั้งทีมเขียนโค้ดได้กระชับขึ้นและดูแลรักษาระบบได้ง่ายขึ้นในระยะยาว!

---

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
