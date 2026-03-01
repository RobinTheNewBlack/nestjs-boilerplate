import { IsString, IsEmail, IsBoolean, IsOptional, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name must not be empty' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name must not be empty' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  lastName: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email must not be empty' })
  @MaxLength(150, { message: 'Email must not exceed 150 characters' })
  email: string;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MinLength(9, { message: 'Phone must be at least 9 characters long' })
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

  @IsString({ message: 'State must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'State must not exceed 100 characters' })
  state?: string;

  @IsString({ message: 'Zip code must be a string' })
  @IsOptional()
  @MinLength(5, { message: 'Zip code must be at least 5 characters long' })
  @MaxLength(20, { message: 'Zip code must not exceed 20 characters' })
  zipCode?: string;

  @IsString({ message: 'Country must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Country must not exceed 100 characters' })
  country?: string;

  @IsString({ message: 'Company must be a string' })
  @IsOptional()
  @MaxLength(150, { message: 'Company must not exceed 150 characters' })
  company?: string;

  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean;
}

