import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.customerService.getCustomerById(Number(id));
    }

    @Get()
    findAll() {
        return this.customerService.getAllCustomers();
    }

    @Post()
    create(@Body() createCustomerDto: any) {
        return this.customerService.createCustomer(createCustomerDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCustomerDto: any) {
        return this.customerService.updateCustomer(Number(id), updateCustomerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.customerService.deleteCustomer(Number(id));
    }
}
