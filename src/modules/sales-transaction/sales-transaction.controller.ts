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
import { SalesTransactionService } from '@/modules/sales-transaction/sales-transaction.service';
import { CreateSalesTransactionDto } from '@/modules/sales-transaction/dto/create-sales-transaction.dto';
import { UpdateSalesTransactionDto } from '@/modules/sales-transaction/dto/update-sales-transaction.dto';
import { QuerySalesTransactionDto } from '@/modules/sales-transaction/dto/query-sales-transaction.dto';

@ApiTags('Sales Transactions')
@Controller('sales-transactions')
export class SalesTransactionController {
  constructor(
    private readonly salesTransactionService: SalesTransactionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new sales transaction' })
  @ApiResponse({
    status: 201,
    description: 'Sales transaction created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() data: CreateSalesTransactionDto) {
    return this.salesTransactionService.createSalesTransaction(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all sales transactions' })
  @ApiResponse({ status: 200, description: 'List of sales transactions' })
  findAll(@Query() query: QuerySalesTransactionDto) {
    return this.salesTransactionService.getAllSalesTransactions(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get sales transaction by ID' })
  @ApiResponse({ status: 200, description: 'Sales transaction found' })
  @ApiResponse({ status: 404, description: 'Sales transaction not found' })
  findOne(@Param('id') id: string) {
    return this.salesTransactionService.getSalesTransactionById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update sales transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sales transaction updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Sales transaction not found' })
  update(@Param('id') id: string, @Body() data: UpdateSalesTransactionDto) {
    return this.salesTransactionService.updateSalesTransaction(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete sales transaction by ID' })
  @ApiResponse({
    status: 204,
    description: 'Sales transaction deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Sales transaction not found' })
  remove(@Param('id') id: string) {
    return this.salesTransactionService.deleteSalesTransaction(id);
  }
}
