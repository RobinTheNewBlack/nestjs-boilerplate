import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { SalesTransactionController } from '@/modules/sales-transaction/sales-transaction.controller';
import { SalesTransactionService } from '@/modules/sales-transaction/sales-transaction.service';
import { SalesTransactionRepository } from '@/modules/sales-transaction/sales-transaction.repository';

@Module({
    imports: [PrismaModule],
    controllers: [SalesTransactionController],
    providers: [SalesTransactionService, SalesTransactionRepository],
})
export class SalesTransactionModule {}
