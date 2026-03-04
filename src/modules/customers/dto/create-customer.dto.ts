import { IsString, IsEmail, IsBoolean, IsOptional, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerTypeEnum } from '@/common/enums';

export class CreateCustomerDto {
  @ApiProperty({ example: 'CUST001' })
  @MaxLength(50, { message: 'Customer code must not exceed 50 characters' })
  @MinLength(3, { message: 'Customer code must be at least 3 characters' })
  @IsString({ message: 'Customer code must be a string' })
  @IsNotEmpty({ message: 'Customer code must not be empty' })
  customer_code: string;

  @ApiProperty({ example: 'Jane' })
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name must not be empty' })
  first_name: string;

  @ApiProperty({ example: 'Smith' })
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name must not be empty' })
  last_name: string;

  @ApiPropertyOptional({ example: 'jane.smith@example.com' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '0898765432' })
  @MaxLength(15, { message: 'Phone must not exceed 15 characters' })
  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main Street' })
  @MaxLength(255, { message: 'Address must not exceed 255 characters' })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Bangkok' })
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  @IsString({ message: 'City must be a string' })
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: '10110' })
  @MaxLength(20, { message: 'Postal code must not exceed 20 characters' })
  @IsString({ message: 'Postal code must be a string' })
  @IsOptional()
  postal_code?: string;

  @ApiProperty({ example: CustomerTypeEnum.RETAIL, enum: CustomerTypeEnum })
  @IsEnum(CustomerTypeEnum, { message: 'Customer type must be a valid enum' })
  @IsNotEmpty({ message: 'Customer type must not be empty' })
  customer_type: CustomerTypeEnum;

  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  @IsOptional()
  is_active?: boolean;
}
