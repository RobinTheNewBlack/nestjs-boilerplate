import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateSalesTransactionDto } from '@/modules/sales-transaction/dto/create-sales-transaction.dto';
import { UpdateSalesTransactionDto } from '@/modules/sales-transaction/dto/update-sales-transaction.dto';
import { QuerySalesTransactionDto } from '@/modules/sales-transaction/dto/query-sales-transaction.dto';

@Injectable()
export class SalesTransactionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateSalesTransactionDto) {
        return await this.prisma.salesTransaction.create({
            data,
            include: { customer: true, employee: true, items: true },
        });
    }

    async findAll(query: QuerySalesTransactionDto) {
        return await this.prisma.salesTransaction.findMany({
            where: query,
            include: { customer: true, employee: true, items: true },
        });
    }

    async findById(uuid: string) {
        return await this.prisma.salesTransaction.findUnique({
            where: { uuid },
            include: { customer: true, employee: true, items: true },
        });
    }

    async update(uuid: string, data: UpdateSalesTransactionDto) {
        return await this.prisma.salesTransaction.update({
            where: { uuid },
            data,
            include: { customer: true, employee: true, items: true },
        });
    }

    async delete(uuid: string) {
        return await this.prisma.salesTransaction.delete({ where: { uuid } });
    }
}
