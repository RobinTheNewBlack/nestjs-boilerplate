import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { EmployeeModule } from './modules/employee/employee.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ProductModule } from './modules/product/product.module';
import { SalesTransactionModule } from './modules/sales-transaction/sales-transaction.module';
import { SalesTransactionItemModule } from './modules/sales-transaction-item/sales-transaction-item.module';

@Module({
  imports: [EmployeeModule, InventoryModule, ProductModule, SalesTransactionModule, SalesTransactionItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
