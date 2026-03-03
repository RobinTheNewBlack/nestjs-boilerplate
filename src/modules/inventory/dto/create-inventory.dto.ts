import {
    IsString,
    IsBoolean,
    IsOptional,
    IsNotEmpty,
    IsInt,
    MaxLength,
    IsUUID,
    Min,
} from 'class-validator';

export class CreateInventoryDto {
    @IsUUID('4', { message: 'Product UUID must be a valid UUID' })
    @IsNotEmpty({ message: 'Product UUID must not be empty' })
    product_uuid: string;

    @IsString({ message: 'Warehouse name must be a string' })
    @IsNotEmpty({ message: 'Warehouse name must not be empty' })
    @MaxLength(100, { message: 'Warehouse name must not exceed 100 characters' })
    warehouse_name: string;

    @IsInt({ message: 'Quantity must be an integer' })
    @Min(0, { message: 'Quantity must be at least 0' })
    @IsNotEmpty({ message: 'Quantity must not be empty' })
    quantity: number;

    @IsBoolean({ message: 'is_active must be a boolean value' })
    @IsOptional()
    is_active?: boolean;
}
