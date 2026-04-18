import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateSalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/create-sales-transaction-item.dto';
import { UpdateSalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/update-sales-transaction-item.dto';
import { QuerySalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/query-sales-transaction-item.dto';

@Injectable()
export class SalesTransactionItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSalesTransactionItemDto) {
    return await this.prisma.salesTransactionItem.create({
      data,
      include: { product: true, transaction: true },
    });
  }

  async findAll(query: QuerySalesTransactionItemDto) {
    return await this.prisma.salesTransactionItem.findMany({
      where: query,
      include: { product: true, transaction: true },
    });
  }

  async findById(uuid: string) {
    return await this.prisma.salesTransactionItem.findUnique({
      where: { uuid },
      include: { product: true, transaction: true },
    });
  }

  async update(uuid: string, data: UpdateSalesTransactionItemDto) {
    return await this.prisma.salesTransactionItem.update({
      where: { uuid },
      data,
      include: { product: true, transaction: true },
    });
  }

  async delete(uuid: string) {
    return await this.prisma.salesTransactionItem.delete({ where: { uuid } });
  }
}
