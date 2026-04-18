import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import compression from 'compression';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const envLogLevels = process.env.LOG_LEVELS
    ? (process.env.LOG_LEVELS.split(',') as any[])
    : ['error', 'warn', 'log'];
  const app = await NestFactory.create(AppModule, {
    logger: envLogLevels,
  });

  // ── Middleware (Express-level) ──
  app.use(helmet()); // Security headers
  app.use(compression()); // Gzip response
  app.enableCors({
    // CORS
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  });

  // ── Global Pipe ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ตัดฟิลด์ขยะที่ไม่ได้กำหนดไว้ใน DTO ทิ้งอัตโนมัติ
      forbidNonWhitelisted: true, // ถ้ามีฟิลด์ขยะโผล่มา ให้ Throw Error ทันที
      transform: true, // แปลง Payload ให้เป็น Instance ของ DTO Class
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errors = validationErrors.map((err) => ({
          field: err.property,
          message: Object.values(err.constraints ?? {}),
        }));
        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );

  // ── Global Prefix ──
  app.setGlobalPrefix('api/v1');

  // ── Swagger UI ──
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
