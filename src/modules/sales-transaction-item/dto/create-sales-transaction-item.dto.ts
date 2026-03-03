import {
    IsNotEmpty,
    IsNumber,
    IsInt,
    IsUUID,
    Min,
} from 'class-validator';

export class CreateSalesTransactionItemDto {
    @IsUUID('4', { message: 'Sale UUID must be a valid UUID' })
    @IsNotEmpty({ message: 'Sale UUID must not be empty' })
    sale_uuid: string;

    @IsUUID('4', { message: 'Product UUID must be a valid UUID' })
    @IsNotEmpty({ message: 'Product UUID must not be empty' })
    product_uuid: string;

    @Min(1, { message: 'Quantity must be at least 1' })
    @IsInt({ message: 'Quantity must be an integer' })
    @IsNotEmpty({ message: 'Quantity must not be empty' })
    quantity: number;

    @Min(0, { message: 'Unit price must be at least 0' })
    @IsNumber({}, { message: 'Unit price must be a number' })
    @IsNotEmpty({ message: 'Unit price must not be empty' })
    unit_price: number;

    @Min(0, { message: 'Discount amount must be at least 0' })
    @IsNumber({}, { message: 'Discount amount must be a number' })
    @IsNotEmpty({ message: 'Discount amount must not be empty' })
    discount_amount: number;

    @Min(0, { message: 'Subtotal must be at least 0' })
    @IsNumber({}, { message: 'Subtotal must be a number' })
    @IsNotEmpty({ message: 'Subtotal must not be empty' })
    subtotal: number;
}
