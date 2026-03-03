import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateInventoryDto } from '@/modules/inventory/dto/create-inventory.dto';
import { UpdateInventoryDto } from '@/modules/inventory/dto/update-inventory.dto';
import { QueryInventoryDto } from '@/modules/inventory/dto/query-inventory.dto';

@Injectable()
export class InventoryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateInventoryDto) {
        return await this.prisma.inventory.create({
            data,
            include: { product: true },
        });
    }

    async findAll(query: QueryInventoryDto) {
        return await this.prisma.inventory.findMany({
            where: query,
            include: { product: true },
        });
    }

    async findById(uuid: string) {
        return await this.prisma.inventory.findUnique({
            where: { uuid },
            include: { product: true },
        });
    }

    async update(uuid: string, data: UpdateInventoryDto) {
        return await this.prisma.inventory.update({
            where: { uuid },
            data,
            include: { product: true },
        });
    }

    async delete(uuid: string) {
        return await this.prisma.inventory.delete({ where: { uuid } });
    }
}
