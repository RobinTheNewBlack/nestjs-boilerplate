import { IsString, IsEmail, IsBoolean, IsOptional, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';
import { CustomerTypeEnum } from '@/common/enums';

export class CreateCustomerDto {
  @MaxLength(50, { message: 'Customer code must not exceed 50 characters' })
  @MinLength(3, { message: 'Customer code must be at least 3 characters' })
  @IsString({ message: 'Customer code must be a string' })
  @IsNotEmpty({ message: 'Customer code must not be empty' })
  customer_code: string;

  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name must not be empty' })
  first_name: string;

  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name must not be empty' })
  last_name: string;

  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @MaxLength(15, { message: 'Phone must not exceed 15 characters' })
  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  phone?: string;

  @MaxLength(255, { message: 'Address must not exceed 255 characters' })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;

  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  @IsString({ message: 'City must be a string' })
  @IsOptional()
  city?: string;

  @MaxLength(20, { message: 'Postal code must not exceed 20 characters' })
  @IsString({ message: 'Postal code must be a string' })
  @IsOptional()
  postal_code?: string;

  @IsEnum(CustomerTypeEnum, { message: 'Customer type must be a valid enum' })
  @IsNotEmpty({ message: 'Customer type must not be empty' })
  customer_type: CustomerTypeEnum;

  @IsBoolean({ message: 'is_active must be a boolean value' })
  @IsOptional()
  is_active?: boolean;
}
