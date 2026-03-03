## 4.7 Interfaces ใน NestJS (กำหนดโครงสร้างข้อมูลร่วมกัน)

Interface คือ **สัญญา (Contract)** ที่บอกว่าข้อมูลก้อนหนึ่งต้องมีหน้าตาแบบไหน ไม่มี Runtime overhead เลยเพราะ TypeScript ลบออกทั้งหมดหลัง Compile เหลือแต่ประโยชน์ด้าน Type Safety และ Auto-complete ใน IDE

**Interface ต่างจาก DTO ตรงไหน?**

| | DTO | Interface |
|---|---|---|
| **วัตถุประสงค์** | Validate ข้อมูลขาเข้า (Request Body) | กำหนดโครงสร้างภายในโค้ด |
| **Decorator** | ใช้ `@IsString()`, `@IsEmail()` ฯลฯ | ไม่มี Decorator |
| **ใช้ที่ไหน** | Controller รับ Request | Service, Repository, Guard, Interceptor |
| **Runtime** | มีตัวตนตอน Runtime (class) | ถูกลบหลัง Compile (type เท่านั้น) |

---

### 📂 สองที่สำหรับวาง Interface และกฎในการเลือก

```
ถาม: "Interface นี้มีคนใช้กี่ Module?"

  1 Module  →  src/modules/<module-name>/interfaces/
  2+ Module →  src/common/interfaces/
```

---

### 🌐 `src/common/interfaces/` — ใช้ข้ามหลาย Module

#### `paginated-result.interface.ts`

ใช้ทุกครั้งที่ Repository คืนผลลัพธ์แบบแบ่งหน้า ไม่ว่าจะเป็น Customer, Product, หรือ Employee

```typescript
// src/common/interfaces/paginated-result.interface.ts
export interface PaginatedResult<T> {
    data: T[];
    total: number;       // จำนวน record ทั้งหมดใน DB (ก่อน paginate)
    page: number;        // หน้าปัจจุบัน (เริ่มจาก 1)
    limit: number;       // จำนวน record ต่อหน้า
    totalPages: number;  // Math.ceil(total / limit)
}
```

**วิธีใช้ใน Repository:**

```typescript
// src/modules/customers/customer.repository.ts
import { PaginatedResult } from '@/common/interfaces';

async findAllPaginated(page: number, limit: number): Promise<PaginatedResult<Customer>> {
    const [data, total] = await Promise.all([
        this.prisma.customer.findMany({ skip: (page - 1) * limit, take: limit }),
        this.prisma.customer.count(),
    ]);

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}
```

---

#### `request-with-user.interface.ts`

ขยาย Express `Request` ให้รู้จัก property ที่ NestJS แนบเพิ่มระหว่าง Request Lifecycle

```typescript
// src/common/interfaces/request-with-user.interface.ts
import { Request } from 'express';

// shape ของ payload หลัง decode JWT token — JwtAuthGuard เป็นคนแนบ object นี้ไว้ที่ req.user
export interface JwtPayload {
    sub: string;    // uuid ของ user
    email: string;
    role: string;
}

// ใครแนบอะไรไว้ที่ request บ้าง?
// - correlationId : CorrelationIdMiddleware (correlation-id.middleware.ts)
// - user          : JwtAuthGuard หลัง decode token (optional เพราะบาง route เป็น public)
export interface RequestWithUser extends Request {
    correlationId: string;
    user?: JwtPayload;
}
```

**วิธีใช้ใน Controller:**

```typescript
// src/modules/customers/customer.controller.ts
import { Req } from '@nestjs/common';
import { RequestWithUser } from '@/common/interfaces';

@Get('me')
getMe(@Req() req: RequestWithUser) {
    console.log(req.correlationId); // มาจาก CorrelationIdMiddleware
    console.log(req.user.email);    // มาจาก JwtAuthGuard
}
```

**วิธีใช้ใน Interceptor:**

```typescript
// src/common/interceptors/logging.interceptor.ts
import { RequestWithUser } from '@/common/interfaces';

intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    console.log(`[${req.correlationId}] ${req.method} ${req.url}`);
    return next.handle();
}
```

---

### 📦 `src/modules/customers/interfaces/` — เฉพาะ CustomerModule

#### `customer-with-transactions.interface.ts`

shape ที่ CustomerRepository คืนมาเมื่อ query แบบ `include: { salesTransactions: true }` — ใช้แค่ใน CustomerModule เท่านั้น

```typescript
// src/modules/customers/interfaces/customer-with-transactions.interface.ts
import { CustomerTypeEnum, PaymentMethodEnum, PaymentStatusEnum, TransactionStatusEnum } from '@/common/enums';

export interface CustomerTransaction {
    uuid: string;
    sale_date: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payment_method: PaymentMethodEnum;
    payment_status: PaymentStatusEnum;
    status: TransactionStatusEnum;
    notes: string | null;
}

export interface CustomerWithTransactions {
    uuid: string;
    customer_code: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    customer_type: CustomerTypeEnum;
    is_active: boolean;
    salesTransactions: CustomerTransaction[];
}
```

**วิธีใช้ใน Repository:**

```typescript
// src/modules/customers/customer.repository.ts
import { CustomerWithTransactions } from '@/modules/customers/interfaces';

async findWithTransactions(uuid: string): Promise<CustomerWithTransactions | null> {
    return this.prisma.customer.findUnique({
        where: { uuid },
        include: { salesTransactions: true },
    });
}
```

---

#### `customer-summary.interface.ts`

shape สำหรับ list view — ดึงแค่ field ที่จำเป็น และมี `full_name` (computed) กับ `total_transactions` (aggregated) ซึ่งไม่มีใน DTO

```typescript
// src/modules/customers/interfaces/customer-summary.interface.ts
import { CustomerTypeEnum } from '@/common/enums';

export interface CustomerSummary {
    uuid: string;
    customer_code: string;
    full_name: string;           // first_name + ' ' + last_name (computed ใน repository)
    email: string | null;
    customer_type: CustomerTypeEnum;
    is_active: boolean;
    total_transactions: number;  // count ของ salesTransactions (aggregated ใน query)
}
```

**วิธีใช้ใน Repository:**

```typescript
// src/modules/customers/customer.repository.ts
import { CustomerSummary } from '@/modules/customers/interfaces';

async findSummaries(): Promise<CustomerSummary[]> {
    const customers = await this.prisma.customer.findMany({
        include: { _count: { select: { salesTransactions: true } } },
    });

    return customers.map((c) => ({
        uuid: c.uuid,
        customer_code: c.customer_code,
        full_name: `${c.first_name} ${c.last_name}`,  // computed
        email: c.email,
        customer_type: c.customer_type,
        is_active: c.is_active,
        total_transactions: c._count.salesTransactions, // aggregated
    }));
}
```

---

### 🗂️ Barrel Export (`index.ts`)

สร้าง `index.ts` ในแต่ละ interfaces folder เพื่อ import จากที่เดียว

```typescript
// src/common/interfaces/index.ts
export * from './paginated-result.interface';
export * from './request-with-user.interface';
```

```typescript
// src/modules/customers/interfaces/index.ts
export * from './customer-with-transactions.interface';
export * from './customer-summary.interface';
```

**import แบบสะอาด:**

```typescript
// ❌ ต้องรู้ชื่อไฟล์ทุกตัว
import { PaginatedResult } from '@/common/interfaces/paginated-result.interface';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';

// ✅ import จากที่เดียว
import { PaginatedResult, RequestWithUser } from '@/common/interfaces';
```

---
