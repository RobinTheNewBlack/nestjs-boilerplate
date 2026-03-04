import {
    IsNotEmpty,
    IsNumber,
    IsInt,
    IsUUID,
    Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalesTransactionItemDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
    @IsUUID('4', { message: 'Sale UUID must be a valid UUID' })
    @IsNotEmpty({ message: 'Sale UUID must not be empty' })
    sale_uuid: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsUUID('4', { message: 'Product UUID must be a valid UUID' })
    @IsNotEmpty({ message: 'Product UUID must not be empty' })
    product_uuid: string;

    @ApiProperty({ example: 2 })
    @Min(1, { message: 'Quantity must be at least 1' })
    @IsInt({ message: 'Quantity must be an integer' })
    @IsNotEmpty({ message: 'Quantity must not be empty' })
    quantity: number;

    @ApiProperty({ example: 399.00 })
    @Min(0, { message: 'Unit price must be at least 0' })
    @IsNumber({}, { message: 'Unit price must be a number' })
    @IsNotEmpty({ message: 'Unit price must not be empty' })
    unit_price: number;

    @ApiProperty({ example: 0 })
    @Min(0, { message: 'Discount amount must be at least 0' })
    @IsNumber({}, { message: 'Discount amount must be a number' })
    @IsNotEmpty({ message: 'Discount amount must not be empty' })
    discount_amount: number;

    @ApiProperty({ example: 798.00 })
    @Min(0, { message: 'Subtotal must be at least 0' })
    @IsNumber({}, { message: 'Subtotal must be a number' })
    @IsNotEmpty({ message: 'Subtotal must not be empty' })
    subtotal: number;
}
