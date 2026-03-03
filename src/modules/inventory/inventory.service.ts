import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from '@/modules/inventory/inventory.repository';
import { CreateInventoryDto } from '@/modules/inventory/dto/create-inventory.dto';
import { UpdateInventoryDto } from '@/modules/inventory/dto/update-inventory.dto';
import { QueryInventoryDto } from '@/modules/inventory/dto/query-inventory.dto';
import { ERROR_MESSAGES } from '@/common/constants/error-messages.constant';

@Injectable()
export class InventoryService {
    constructor(private readonly inventoryRepository: InventoryRepository) {}

    async createInventory(data: CreateInventoryDto) {
        return await this.inventoryRepository.create(data);
    }

    async getAllInventories(query: QueryInventoryDto) {
        return await this.inventoryRepository.findAll(query);
    }

    async getInventoryById(uuid: string) {
        const inventory = await this.inventoryRepository.findById(uuid);
        if (!inventory) {
            throw new NotFoundException(ERROR_MESSAGES.INVENTORY.NOT_FOUND(uuid));
        }
        return inventory;
    }

    async updateInventory(uuid: string, data: UpdateInventoryDto) {
        await this.getInventoryById(uuid);
        return await this.inventoryRepository.update(uuid, data);
    }

    async deleteInventory(uuid: string) {
        await this.getInventoryById(uuid);
        return await this.inventoryRepository.delete(uuid);
    }
}
