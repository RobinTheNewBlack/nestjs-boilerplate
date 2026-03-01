import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ตัดฟิลด์ขยะที่ไม่ได้กำหนดไว้ใน DTO ทิ้งอัตโนมัติ
    forbidNonWhitelisted: true, // ถ้ามีฟิลด์ขยะโผล่มา ให้ Throw Error ทันที
    transform: true, // แปลง Payload ให้เป็น Instance ของ DTO Class
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
