import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { InventoryService } from '@/modules/inventory/inventory.service';
import { CreateInventoryDto } from '@/modules/inventory/dto/create-inventory.dto';
import { UpdateInventoryDto } from '@/modules/inventory/dto/update-inventory.dto';
import { QueryInventoryDto } from '@/modules/inventory/dto/query-inventory.dto';

@Controller('inventories')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() data: CreateInventoryDto) {
        return this.inventoryService.createInventory(data);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(@Query() query: QueryInventoryDto) {
        return this.inventoryService.getAllInventories(query);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
        return this.inventoryService.getInventoryById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: string, @Body() data: UpdateInventoryDto) {
        return this.inventoryService.updateInventory(id, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.inventoryService.deleteInventory(id);
    }
}
