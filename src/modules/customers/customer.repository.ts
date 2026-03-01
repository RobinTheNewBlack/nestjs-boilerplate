import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateCustomerDto } from '@/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/modules/customers/dto/update-customer.dto';
import { QueryCustomerDto } from '@/modules/customers/dto/query-customer.dto';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCustomerDto) {
    return await this.prisma.customer.create({
      data,
    });
  }

  async findAll(query: QueryCustomerDto) {
    return await this.prisma.customer.findMany({ where: query });
  }

  async findById(id: number) {
    return await this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateCustomerDto) {
    return await this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await this.prisma.customer.delete({
      where: { id },
    });
  }
}
