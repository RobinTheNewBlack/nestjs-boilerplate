import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Middleware (Express-level) ──
  app.use(helmet());                            // Security headers
  app.use(compression());                       // Gzip response
  app.enableCors({                              // CORS
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  });

  // ── Global Pipe ──
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ตัดฟิลด์ขยะที่ไม่ได้กำหนดไว้ใน DTO ทิ้งอัตโนมัติ
    forbidNonWhitelisted: true, // ถ้ามีฟิลด์ขยะโผล่มา ให้ Throw Error ทันที
    transform: true, // แปลง Payload ให้เป็น Instance ของ DTO Class
  }));

  // ── Global Prefix ──
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
