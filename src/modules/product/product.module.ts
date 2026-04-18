import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { ProductController } from '@/modules/product/product.controller';
import { ProductService } from '@/modules/product/product.service';
import { ProductRepository } from '@/modules/product/product.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
