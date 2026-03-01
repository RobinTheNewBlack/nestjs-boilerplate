import { Module } from '@nestjs/common';
import { CustomerController } from '@/modules/customers/customer.controller';
import { CustomerService } from '@/modules/customers/customer.service';
import { CustomerRepository } from '@/modules/customers/customer.repository';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
