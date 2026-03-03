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
