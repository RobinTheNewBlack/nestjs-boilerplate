import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '@/modules/product/product.repository';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/product/dto/update-product.dto';
import { QueryProductDto } from '@/modules/product/dto/query-product.dto';
import { ERROR_MESSAGES } from '@/common/constants/error-messages.constant';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) {}

    async createProduct(data: CreateProductDto) {
        return await this.productRepository.create(data);
    }

    async getAllProducts(query: QueryProductDto) {
        return await this.productRepository.findAll(query);
    }

    async getProductById(uuid: string) {
        const product = await this.productRepository.findById(uuid);
        if (!product) {
            throw new NotFoundException(ERROR_MESSAGES.PRODUCT.NOT_FOUND(uuid));
        }
        return product;
    }

    async updateProduct(uuid: string, data: UpdateProductDto) {
        await this.getProductById(uuid);
        return await this.productRepository.update(uuid, data);
    }

    async deleteProduct(uuid: string) {
        await this.getProductById(uuid);
        return await this.productRepository.delete(uuid);
    }
}
