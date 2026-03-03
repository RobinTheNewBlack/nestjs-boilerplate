import { IsString, IsBoolean, IsOptional, MaxLength, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryInventoryDto {
    @IsUUID('4')
    @IsOptional()
    product_uuid?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    warehouse_name?: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    is_active?: boolean;
}
