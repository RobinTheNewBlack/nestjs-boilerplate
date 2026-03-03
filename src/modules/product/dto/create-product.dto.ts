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
import { ProductCategoryEnum } from '@/common/enums';

export class CreateProductDto {
    @IsString({ message: 'Product code must be a string' })
    @IsNotEmpty({ message: 'Product code must not be empty' })
    @MinLength(3, { message: 'Product code must be at least 3 characters' })
    @MaxLength(50, { message: 'Product code must not exceed 50 characters' })
    product_code: string;

    @IsString({ message: 'Product name must be a string' })
    @IsNotEmpty({ message: 'Product name must not be empty' })
    @MaxLength(200, { message: 'Product name must not exceed 200 characters' })
    product_name: string;

    @IsEnum(ProductCategoryEnum, { message: 'Category must be a valid enum value' })
    @IsNotEmpty({ message: 'Category must not be empty' })
    category: ProductCategoryEnum;

    @IsNumber({}, { message: 'Cost price must be a number' })
    @Min(0, { message: 'Cost price must be at least 0' })
    @IsNotEmpty({ message: 'Cost price must not be empty' })
    cost_price: number;

    @IsNumber({}, { message: 'Selling price must be a number' })
    @Min(0, { message: 'Selling price must be at least 0' })
    @IsNotEmpty({ message: 'Selling price must not be empty' })
    selling_price: number;

    @IsBoolean({ message: 'is_active must be a boolean value' })
    @IsOptional()
    is_active?: boolean;
}
