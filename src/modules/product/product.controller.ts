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
import { ProductService } from '@/modules/product/product.service';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/product/dto/update-product.dto';
import { QueryProductDto } from '@/modules/product/dto/query-product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() data: CreateProductDto) {
        return this.productService.createProduct(data);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(@Query() query: QueryProductDto) {
        return this.productService.getAllProducts(query);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
        return this.productService.getProductById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: string, @Body() data: UpdateProductDto) {
        return this.productService.updateProduct(id, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.productService.deleteProduct(id);
    }
}
