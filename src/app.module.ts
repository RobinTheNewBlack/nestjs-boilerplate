import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from '@/app.controller';
import { EmployeeModule } from './modules/employee/employee.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ProductModule } from './modules/product/product.module';
import { SalesTransactionModule } from './modules/sales-transaction/sales-transaction.module';
import { SalesTransactionItemModule } from './modules/sales-transaction-item/sales-transaction-item.module';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CustomerModule } from './modules/customers/customer.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',       // ป้องกัน burst request
        ttl: 1000,           // 1 วินาที
        limit: 3,            // สูงสุด 3 requests ต่อวินาที (ต่อ 1 IP)
      },
      {
        name: 'medium',      // ป้องกัน abuse ระดับปานกลาง
        ttl: 10000,          // 10 วินาที
        limit: 20,           // สูงสุด 20 requests ต่อ 10 วินาที (ต่อ 1 IP)
      },
      {
        name: 'long',        // ป้องกัน abuse ระยะยาว
        ttl: 60000,          // 1 นาที
        limit: 100,          // สูงสุด 100 requests ต่อนาที (ต่อ 1 IP)
      },
    ]),
    EmployeeModule,
    InventoryModule,
    ProductModule,
    SalesTransactionModule,
    SalesTransactionItemModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Global Rate Limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  // ลงทะเบียน Middleware ของเราตรงนี้
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware, LoggerMiddleware)
      .forRoutes('*'); // ให้ทำงานกับทุกๆ Route
  }
}
