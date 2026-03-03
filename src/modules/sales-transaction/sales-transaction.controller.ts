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
import { SalesTransactionService } from '@/modules/sales-transaction/sales-transaction.service';
import { CreateSalesTransactionDto } from '@/modules/sales-transaction/dto/create-sales-transaction.dto';
import { UpdateSalesTransactionDto } from '@/modules/sales-transaction/dto/update-sales-transaction.dto';
import { QuerySalesTransactionDto } from '@/modules/sales-transaction/dto/query-sales-transaction.dto';

@Controller('sales-transactions')
export class SalesTransactionController {
    constructor(private readonly salesTransactionService: SalesTransactionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() data: CreateSalesTransactionDto) {
        return this.salesTransactionService.createSalesTransaction(data);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(@Query() query: QuerySalesTransactionDto) {
        return this.salesTransactionService.getAllSalesTransactions(query);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
        return this.salesTransactionService.getSalesTransactionById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: string, @Body() data: UpdateSalesTransactionDto) {
        return this.salesTransactionService.updateSalesTransaction(id, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.salesTransactionService.deleteSalesTransaction(id);
    }
}
