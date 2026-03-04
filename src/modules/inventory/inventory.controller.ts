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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InventoryService } from '@/modules/inventory/inventory.service';
import { CreateInventoryDto } from '@/modules/inventory/dto/create-inventory.dto';
import { UpdateInventoryDto } from '@/modules/inventory/dto/update-inventory.dto';
import { QueryInventoryDto } from '@/modules/inventory/dto/query-inventory.dto';

@ApiTags('Inventories')
@Controller('inventories')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new inventory record' })
    @ApiResponse({ status: 201, description: 'Inventory created successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    create(@Body() data: CreateInventoryDto) {
        return this.inventoryService.createInventory(data);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all inventory records' })
    @ApiResponse({ status: 200, description: 'List of inventory records' })
    findAll(@Query() query: QueryInventoryDto) {
        return this.inventoryService.getAllInventories(query);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get inventory record by ID' })
    @ApiResponse({ status: 200, description: 'Inventory record found' })
    @ApiResponse({ status: 404, description: 'Inventory record not found' })
    findOne(@Param('id') id: string) {
        return this.inventoryService.getInventoryById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update inventory record by ID' })
    @ApiResponse({ status: 200, description: 'Inventory updated successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @ApiResponse({ status: 404, description: 'Inventory record not found' })
    update(@Param('id') id: string, @Body() data: UpdateInventoryDto) {
        return this.inventoryService.updateInventory(id, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete inventory record by ID' })
    @ApiResponse({ status: 204, description: 'Inventory deleted successfully' })
    @ApiResponse({ status: 404, description: 'Inventory record not found' })
    remove(@Param('id') id: string) {
        return this.inventoryService.deleteInventory(id);
    }
}
