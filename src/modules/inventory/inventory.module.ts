import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { InventoryController } from '@/modules/inventory/inventory.controller';
import { InventoryService } from '@/modules/inventory/inventory.service';
import { InventoryRepository } from '@/modules/inventory/inventory.repository';

@Module({
    imports: [PrismaModule],
    controllers: [InventoryController],
    providers: [InventoryService, InventoryRepository],
})
export class InventoryModule {}
