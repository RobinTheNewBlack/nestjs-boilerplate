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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID('4', { message: 'Product UUID must be a valid UUID' })
  @IsNotEmpty({ message: 'Product UUID must not be empty' })
  product_uuid: string;

  @ApiProperty({ example: 'Main Warehouse' })
  @MaxLength(100, { message: 'Warehouse name must not exceed 100 characters' })
  @IsString({ message: 'Warehouse name must be a string' })
  @IsNotEmpty({ message: 'Warehouse name must not be empty' })
  warehouse_name: string;

  @ApiProperty({ example: 100 })
  @Min(0, { message: 'Quantity must be at least 0' })
  @IsInt({ message: 'Quantity must be an integer' })
  @IsNotEmpty({ message: 'Quantity must not be empty' })
  quantity: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  @IsOptional()
  is_active?: boolean;
}
