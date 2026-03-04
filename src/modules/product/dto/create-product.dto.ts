import {
    IsString,
    IsBoolean,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    MinLength,
    MaxLength,
    IsEnum,
    Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategoryEnum } from '@/common/enums';

export class CreateProductDto {
    @ApiProperty({ example: 'PRD001' })
    @MaxLength(50, { message: 'Product code must not exceed 50 characters' })
    @MinLength(3, { message: 'Product code must be at least 3 characters' })
    @IsString({ message: 'Product code must be a string' })
    @IsNotEmpty({ message: 'Product code must not be empty' })
    product_code: string;

    @ApiProperty({ example: 'Wireless Mouse' })
    @MaxLength(200, { message: 'Product name must not exceed 200 characters' })
    @IsString({ message: 'Product name must be a string' })
    @IsNotEmpty({ message: 'Product name must not be empty' })
    product_name: string;

    @ApiProperty({ example: ProductCategoryEnum.ELECTRONICS, enum: ProductCategoryEnum })
    @IsEnum(ProductCategoryEnum, { message: 'Category must be a valid enum value' })
    @IsNotEmpty({ message: 'Category must not be empty' })
    category: ProductCategoryEnum;

    @ApiProperty({ example: 250.00 })
    @Min(0, { message: 'Cost price must be at least 0' })
    @IsNumber({}, { message: 'Cost price must be a number' })
    @IsNotEmpty({ message: 'Cost price must not be empty' })
    cost_price: number;

    @ApiProperty({ example: 399.00 })
    @Min(0, { message: 'Selling price must be at least 0' })
    @IsNumber({}, { message: 'Selling price must be a number' })
    @IsNotEmpty({ message: 'Selling price must not be empty' })
    selling_price: number;

    @ApiPropertyOptional({ example: true })
    @IsBoolean({ message: 'is_active must be a boolean value' })
    @IsOptional()
    is_active?: boolean;
}
