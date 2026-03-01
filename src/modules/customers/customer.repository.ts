import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateCustomerDto) {
        return await this.prisma.customer.create({
            data,
        });
    }

    async findAll() {
        return await this.prisma.customer.findMany();
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