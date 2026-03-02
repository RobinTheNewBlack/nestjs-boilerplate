import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateCustomerDto } from '@/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/modules/customers/dto/update-customer.dto';
import { QueryCustomerDto } from '@/modules/customers/dto/query-customer.dto';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateCustomerDto) {
    return await this.prisma.customer.create({
      data,
    });
  }

  async findAll(query: QueryCustomerDto) {
    return await this.prisma.customer.findMany({ where: query });
  }

  async findById(uuid: string) {
    return await this.prisma.customer.findUnique({
      where: { uuid },
    });
  }

  async update(uuid: string, data: UpdateCustomerDto) {
    return await this.prisma.customer.update({
      where: { uuid },
      data,
    });
  }

  async delete(uuid: string) {
    return await this.prisma.customer.delete({
      where: { uuid },
    });
  }
}
