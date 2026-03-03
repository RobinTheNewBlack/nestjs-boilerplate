import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/product/dto/update-product.dto';
import { QueryProductDto } from '@/modules/product/dto/query-product.dto';

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateProductDto) {
        return await this.prisma.product.create({ data });
    }

    async findAll(query: QueryProductDto) {
        return await this.prisma.product.findMany({ where: query });
    }

    async findById(uuid: string) {
        return await this.prisma.product.findUnique({ where: { uuid } });
    }

    async update(uuid: string, data: UpdateProductDto) {
        return await this.prisma.product.update({ where: { uuid }, data });
    }

    async delete(uuid: string) {
        return await this.prisma.product.delete({ where: { uuid } });
    }
}
