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
import { CustomerService } from '@/modules/customers/customer.service';
import { CreateCustomerDto } from '@/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/modules/customers/dto/update-customer.dto';
import { QueryCustomerDto } from '@/modules/customers/dto/query-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateCustomerDto) {
    return this.customerService.createCustomer(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.getCustomerById(Number(id));
  }

  @Get()
  findAll(@Query() query: QueryCustomerDto) {
    return this.customerService.getAllCustomers(query);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return this.customerService.updateCustomer(Number(id), updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.customerService.deleteCustomer(Number(id));
  }
}
