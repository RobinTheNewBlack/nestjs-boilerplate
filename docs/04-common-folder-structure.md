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

### 🔄 ลำดับการทำงานของ Request ใน NestJS (Request Lifecycle)

เครื่องมือแต่ละชิ้นใน `/common` ทำงานคนละขั้นตอนใน Pipeline ของ NestJS ดังนี้:

```
Client Request
     │
     ▼
 ┌─────────────┐
 │  Middleware  │  → ทำงานกับ raw Request/Response (Express-level)
 └──────┬──────┘
        ▼
 ┌─────────────┐
 │   Guards    │  → อนุญาตให้เข้ามั้ย? (Auth, Role)
 └──────┬──────┘
        ▼
 ┌──────────────┐
 │ Interceptors │  → แปลง request/response, จับเวลา, cache
 │  (before)    │
 └──────┬───────┘
        ▼
 ┌─────────────┐
 │   Pipes     │  → validate & transform ข้อมูล
 └──────┬──────┘
        ▼
 ┌──────────────┐
 │  Controller  │  → จัดการ request
 └──────┬───────┘
        ▼
 ┌──────────────┐
 │ Interceptors │  → แปลง response ก่อนส่งกลับ
 │  (after)     │
 └──────┬───────┘
        ▼
 ┌──────────────┐
 │   Filters    │  → จับ error แปลงเป็น response สวยๆ
 └──────┬───────┘
        ▼
    Response
```

---

### 📖 อ่านรายละเอียดแต่ละเครื่องมือได้ที่

- [5. Middleware](./05-middleware.md)
- [6. Guards](./06-guards.md)
- [7. Exception Filters & Interceptors](./07-filters-and-interceptors.md)
- [8. Rate Limiting](./08-rate-limiting.md)
- [9. Enums](./09-enums.md)

---
