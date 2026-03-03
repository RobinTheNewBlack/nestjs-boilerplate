import { IsString, IsBoolean, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductCategoryEnum } from '@/common/enums';

export class QueryProductDto {
    @MaxLength(50)
    @IsString()
    @IsOptional()
    product_code?: string;

    @MaxLength(200)
    @IsString()
    @IsOptional()
    product_name?: string;

    @IsEnum(ProductCategoryEnum)
    @IsOptional()
    category?: ProductCategoryEnum;

    @IsBoolean()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsOptional()
    is_active?: boolean;
}
