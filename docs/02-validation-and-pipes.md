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

**3. ปรับแต่งรูปแบบ Error Response ด้วย `exceptionFactory` (Official NestJS Practice)**

โดย Default เมื่อ `ValidationPipe` ตรวจพบข้อผิดพลาด มันจะโยน Error ออกมาในรูปแบบนี้:
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "name should not be empty"],
  "error": "Bad Request"
}
```
สังเกตว่า `message` เป็นแค่ Array ของ String ธรรมดา ไม่มีการบอกว่าแต่ละข้อความเป็น Error ของ **field ไหน** เลย ทำให้ฝั่ง Client นำไปแสดงผลได้ยาก

`exceptionFactory` คือ Option ที่ NestJS เปิดให้อย่างเป็นทางการ เพื่อให้เราเข้าไปปรับแต่งรูปแบบของ Error ก่อนที่มันจะถูกโยนออกไปได้เลย โดย `ValidationPipe` จะส่ง Array ของ `ValidationError` (จาก `class-validator`) เข้ามาให้เราจัดการเอง:

```typescript
// src/main.ts
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (validationErrors: ValidationError[]) => {
    // ValidationError แต่ละตัวมีหน้าตาแบบนี้ภายใน:
    // {
    //   property: 'email',           ← ชื่อ field ที่ผิด
    //   constraints: {
    //     isEmail: 'email must be an email',   ← กฎที่ fail พร้อม message
    //     isNotEmpty: 'email should not be empty',
    //   }
    // }

    const errors = validationErrors.map((err) => ({
      field: err.property,                               // ดึงชื่อ field ที่ผิด
      message: Object.values(err.constraints ?? {})[0], // ดึง message ของกฎแรกที่ fail
    }));

    return new BadRequestException({ message: 'Validation failed', errors });
  },
}));
```

ผลที่ได้คือ Error Response จะมีข้อมูลครบถ้วนกว่าเดิมมาก:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email",  "message": "email must be an email" },
    { "field": "name",   "message": "name should not be empty" }
  ]
}
```

> **💡 Note:** `exceptionFactory` เป็น Option ที่อยู่ใน Official NestJS Documentation ไม่ใช่ workaround หรือ hack ใดๆ ทั้งสิ้น รูปแบบ `{ field, message }` ที่เห็นนั้นเป็นการออกแบบของเราเอง (Team Convention) แต่กลไกที่ใช้ทำมันเป็นของ NestJS โดยตรง

---

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
