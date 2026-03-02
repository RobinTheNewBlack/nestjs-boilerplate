import { Module } from '@nestjs/common';
import { SalesTransactionController } from './sales-transaction.controller';
import { SalesTransactionService } from './sales-transaction.service';

@Module({
  controllers: [SalesTransactionController],
  providers: [SalesTransactionService]
})
export class SalesTransactionModule {}
