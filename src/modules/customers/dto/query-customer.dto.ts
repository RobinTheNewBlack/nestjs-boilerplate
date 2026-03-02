import { IsString, IsEmail, IsBoolean, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { CustomerTypeEnum } from 'src/common/enums';
import { Transform } from 'class-transformer';

export class QueryCustomerDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  customer_code?: string;

  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  first_name?: string;

  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  last_name?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email?: string;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MaxLength(15, { message: 'Phone must not exceed 15 characters' })
  phone?: string;

  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'Address must not exceed 255 characters' })
  address?: string;

  @IsString({ message: 'City must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  city?: string;

  @IsString({ message: 'Postal code must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Postal code must not exceed 20 characters' })
  postal_code?: string;

  @IsEnum(CustomerTypeEnum, { message: 'Customer type must be a valid enum' })
  @IsOptional()
  customer_type?: CustomerTypeEnum;

  @IsBoolean({ message: 'is_active must be a boolean value' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  is_active?: boolean;
}
