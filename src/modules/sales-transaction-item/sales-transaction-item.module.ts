import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { SalesTransactionItemController } from '@/modules/sales-transaction-item/sales-transaction-item.controller';
import { SalesTransactionItemService } from '@/modules/sales-transaction-item/sales-transaction-item.service';
import { SalesTransactionItemRepository } from '@/modules/sales-transaction-item/sales-transaction-item.repository';

@Module({
    imports: [PrismaModule],
    controllers: [SalesTransactionItemController],
    providers: [SalesTransactionItemService, SalesTransactionItemRepository],
})
export class SalesTransactionItemModule {}
