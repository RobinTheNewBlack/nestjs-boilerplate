import { IsString, IsBoolean, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductCategoryEnum } from '@/common/enums';

export class QueryProductDto {
    @IsString()
    @IsOptional()
    @MaxLength(50)
    product_code?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    product_name?: string;

    @IsEnum(ProductCategoryEnum)
    @IsOptional()
    category?: ProductCategoryEnum;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    is_active?: boolean;
}
