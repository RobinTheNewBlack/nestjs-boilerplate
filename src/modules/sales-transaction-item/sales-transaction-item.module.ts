import { Module } from '@nestjs/common';
import { SalesTransactionItemController } from './sales-transaction-item.controller';
import { SalesTransactionItemService } from './sales-transaction-item.service';

@Module({
  controllers: [SalesTransactionItemController],
  providers: [SalesTransactionItemService]
})
export class SalesTransactionItemModule {}
