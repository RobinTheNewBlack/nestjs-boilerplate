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
import { SalesTransactionItemService } from '@/modules/sales-transaction-item/sales-transaction-item.service';
import { CreateSalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/create-sales-transaction-item.dto';
import { UpdateSalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/update-sales-transaction-item.dto';
import { QuerySalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/query-sales-transaction-item.dto';

@Controller('sales-transaction-items')
export class SalesTransactionItemController {
    constructor(private readonly salesTransactionItemService: SalesTransactionItemService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() data: CreateSalesTransactionItemDto) {
        return this.salesTransactionItemService.createSalesTransactionItem(data);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(@Query() query: QuerySalesTransactionItemDto) {
        return this.salesTransactionItemService.getAllSalesTransactionItems(query);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
        return this.salesTransactionItemService.getSalesTransactionItemById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: string, @Body() data: UpdateSalesTransactionItemDto) {
        return this.salesTransactionItemService.updateSalesTransactionItem(id, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.salesTransactionItemService.deleteSalesTransactionItem(id);
    }
}
