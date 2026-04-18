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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomerService } from '@/modules/customers/customer.service';
import { CreateCustomerDto } from '@/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/modules/customers/dto/update-customer.dto';
import { QueryCustomerDto } from '@/modules/customers/dto/query-customer.dto';
import { CurrentUser, Roles } from '@/common/decorators';
import type { JwtPayload } from '@/common/interfaces';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() data: CreateCustomerDto, @CurrentUser() user: JwtPayload) {
    console.log(`${user.username} is creating a customer`);
    return this.customerService.createCustomer(data);
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    console.log(`${user.username} is fetching customer ${id}`);
    return this.customerService.getCustomerById(id);
  }

  @Get()
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'List of customers' })
  findAll(@Query() query: QueryCustomerDto, @CurrentUser() user: JwtPayload) {
    console.log(`${user.username} is listing customers`);
    return this.customerService.getAllCustomers(query);
  }

  @Put(':id')
  @Roles('admin', 'manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser() user: JwtPayload,
  ) {
    console.log(`${user.username} is updating customer ${id}`);
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete customer by ID' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    console.log(`${user.username} is deleting customer ${id}`);
    return this.customerService.deleteCustomer(id);
  }
}
