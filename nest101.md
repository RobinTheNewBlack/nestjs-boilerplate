# NestJS 101: ขั้นตอนการสร้าง API Server ด้วย NestJS

## 🧐 ทำไมต้อง NestJS? (เทียบกับ Express เพียวๆ)

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
# โครงสร้างพื้นฐานของ NestJS: Module, Controller, Service และ Repository

NestJS ถูกออกแบบมาเพื่อให้เขียนโค้ดได้อย่างเป็นระเบียบ เป็นสัดส่วน (Modular) และง่ายต่อการดูแลรักษา โครงสร้างจะแบ่งหน้าที่ชัดเจนตามหลักการ Separation of Concerns (SoC) โดยมี 4 ส่วนสำคัญได้แก่:

---

## 1. Module
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

## 2. Controller
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

## 3. Provider (เช่น Services, Repositories, Factories, Helpers เป็นต้น)
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

---

## 6. Pipe และการทำ Data Validation (DTO)

**Pipe** ใน NestJS คือคลาสที่เข้ามาคั่นกลาง (Intercept) ตอนที่ Client ส่งข้อมูลเข้ามา (Request) ก่อนที่ข้อมูลนั้นจะถูกส่งต่อไปถึง Controller สอดคล้องกับภาพตัวอย่างที่คุณส่งมา Pipes มี 2 หน้าที่หลัก คือ:

1. **Transformation (การแปลงข้อมูล):** แปลงข้อมูลที่รับเข้ามาให้อยู่ในหน้าตา/รูปแบบที่ต้องการ เช่น การรับค่าไอดีทาง URL ซึ่งมาเป็น String (`'1'`) แล้ว Pipe ทำการแปลงให้กลายเป็นตัวเลข Integer (`1`) ให้อัตโนมัติ ก่อนส่งเข้า Controller
2. **Validation (ตรวจสอบความถูกต้อง):** ประเมินข้อมูลที่ได้รับมา หากข้อมูลถูกต้องและตรงข้อกำหนด ก็จะปล่อยผ่าน (Pass through) ให้ทำงานต่อไป แต่ถ้าหากตรวจพบข้อมูลที่ไม่ถูกต้องหรือไม่ตรงตามกำหนด Pipe จะจัดการโยน Exception แย้งขึ้นมา (มักจะเป็น `400 Bad Request`) และตัดจบการทำงานทันที ข้อดีคือทำให้ Controller เราไม่ต้องเขียนโค้ดเช็ค `if(!data) { ... }` ซ้ำซาก

### 🛠️ วิธีการใช้งาน Pipe ร่วมกับ DTO (เพื่อทำ Validation)

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

### 🏷️ Validation Decorator แต่ละตัวคืออะไร?

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

### 🧰 Built-in Pipes ทั้ง 9 ตัวใน NestJS และวิธีใช้งาน

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

### 🛡️ การทำ Type / Format Validation ควรทำที่ Layer ไหนใน NestJS?

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
