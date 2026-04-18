import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // สร้างตัวแปร logger โดยระบุ Context ว่า 'HTTP' เพื่อให้จัดกลุ่ม Log ได้ง่าย
  private logger = new Logger(LoggerMiddleware.name);

  use(req: RequestWithUser, res: Response, next: NextFunction) {
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
      const correlationId = req.correlationId || '-';

      // 3. พิมพ์ Log ออกมาทาง Console หรือส่งเข้าไฟล์
      // รูปแบบ: [CorrelationID] GET /api/v1/users 200 120b - PostmanRuntime/7.29.2 ::1 - 15ms
      this.logger.log(
        `[${correlationId}] ${method} ${originalUrl} ${statusCode} ${contentLength}b - ${userAgent} ${ip} - ${responseTime}ms`,
      );
    });

    // 4. ให้ระบบทำงานต่อไป (วิ่งเข้าหา Controller)
    next();
  }
}
