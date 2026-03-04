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
import { SalesTransactionItemService } from '@/modules/sales-transaction-item/sales-transaction-item.service';
import { CreateSalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/create-sales-transaction-item.dto';
import { UpdateSalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/update-sales-transaction-item.dto';
import { QuerySalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/query-sales-transaction-item.dto';

@ApiTags('Sales Transaction Items')
@Controller('sales-transaction-items')
export class SalesTransactionItemController {
    constructor(private readonly salesTransactionItemService: SalesTransactionItemService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new sales transaction item' })
    @ApiResponse({ status: 201, description: 'Sales transaction item created successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    create(@Body() data: CreateSalesTransactionItemDto) {
        return this.salesTransactionItemService.createSalesTransactionItem(data);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all sales transaction items' })
    @ApiResponse({ status: 200, description: 'List of sales transaction items' })
    findAll(@Query() query: QuerySalesTransactionItemDto) {
        return this.salesTransactionItemService.getAllSalesTransactionItems(query);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get sales transaction item by ID' })
    @ApiResponse({ status: 200, description: 'Sales transaction item found' })
    @ApiResponse({ status: 404, description: 'Sales transaction item not found' })
    findOne(@Param('id') id: string) {
        return this.salesTransactionItemService.getSalesTransactionItemById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update sales transaction item by ID' })
    @ApiResponse({ status: 200, description: 'Sales transaction item updated successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @ApiResponse({ status: 404, description: 'Sales transaction item not found' })
    update(@Param('id') id: string, @Body() data: UpdateSalesTransactionItemDto) {
        return this.salesTransactionItemService.updateSalesTransactionItem(id, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete sales transaction item by ID' })
    @ApiResponse({ status: 204, description: 'Sales transaction item deleted successfully' })
    @ApiResponse({ status: 404, description: 'Sales transaction item not found' })
    remove(@Param('id') id: string) {
        return this.salesTransactionItemService.deleteSalesTransactionItem(id);
    }
}
