import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { CustomerController } from '@/modules/customers/customer.controller';
import { CustomerService } from '@/modules/customers/customer.service';
import { CustomerRepository } from '@/modules/customers/customer.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
