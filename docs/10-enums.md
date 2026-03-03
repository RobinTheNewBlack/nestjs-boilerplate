## 10. Enums ใน NestJS (TypeScript Enum & ศูนย์รวมค่าคงที่)

Enum คือการกำหนด **ชุดค่าคงที่ที่เป็นไปได้ทั้งหมด** ให้กับตัวแปรหนึ่งๆ ป้องกันความผิดพลาดจากการพิมพ์ (Typo Error) และทำให้โค้ดอ่านง่ายขึ้นมาก แทนที่จะใช้ String `'PENDING'` ลอยๆ ทั่ว Codebase

---

### 🏷️ ตัวอย่าง: `enums/payment-status.enum.ts`

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

### วิธีนำไปใช้ใน Service และ DTO

```typescript
// src/modules/payment/payment.service.ts
import { PaymentStatus } from '@/common/enums/payment-status.enum';

@Injectable()
export class PaymentService {
  async updateStatus(id: string, status: PaymentStatus) {
    // TypeScript จะเตือนทันทีถ้าใส่ค่าที่ไม่อยู่ใน Enum
    return this.paymentRepository.update(id, { status });
  }
}
```

```typescript
// src/modules/payment/dto/update-payment.dto.ts
import { IsEnum } from 'class-validator';
import { PaymentStatus } from '@/common/enums/payment-status.enum';

export class UpdatePaymentDto {
  @IsEnum(PaymentStatus, { message: 'status ต้องเป็นค่าที่กำหนดไว้เท่านั้น' })
  status: PaymentStatus;
}
```

---

### ข้อดีของการใช้ Enum

| แบบไม่ใช้ Enum | แบบใช้ Enum |
|---|---|
| `status === 'PENDNG'` ← Typo ไม่มีใครรู้! | TypeScript แจ้งเตือนทันที |
| String กระจายอยู่ทั่ว Codebase | เปลี่ยนค่าที่เดียว มีผลทั้งหมด |
| ไม่มี Auto-complete | IDE ช่วย suggest ค่าที่ถูกต้องได้ |

---
