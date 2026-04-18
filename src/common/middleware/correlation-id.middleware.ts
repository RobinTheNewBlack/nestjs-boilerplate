import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { randomUUID } from 'crypto'; // ใช้โมดูลที่มีอยู่แล้วใน Node.js ได้เลย
import { RequestWithUser } from '@/common/interfaces';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: RequestWithUser, res: Response, next: NextFunction) {
    // 1. ตรวจสอบว่ามี Correlation ID ส่งมาจาก Header หรือไม่ (เผื่อระบบอื่นเรียกมา)
    // ปกติมักจะใช้ชื่อ 'x-correlation-id' หรือ 'x-request-id'
    const correlationHeader = req.headers['x-correlation-id'];

    // 2. ถ้าไม่มี ให้สร้าง UUID ใหม่ขึ้นมา
    // Array.isArray guard: header อาจเป็น string[] ถ้า client ส่งมาหลายครั้ง — ใช้แค่ค่าแรก
    const correlationId =
      (Array.isArray(correlationHeader)
        ? correlationHeader[0]
        : correlationHeader) || randomUUID();

    // 3. แนบ ID นี้กลับเข้าไปใน Request Object เพื่อให้ Controller/Service เอาไปใช้ต่อได้
    req.correlationId = correlationId;

    // (ทางเลือก) แนบ ID นี้กลับไปใน Response Header ด้วย เพื่อให้ Frontend หรือ Client รู้อ้างอิง
    res.setHeader('x-correlation-id', correlationId);

    // 4. ส่งไม้ต่อให้ระบบทำงานในขั้นต่อไป (Guard -> Interceptor -> Controller)
    next();
  }
}
