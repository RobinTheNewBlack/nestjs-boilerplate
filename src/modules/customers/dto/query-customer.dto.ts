import { IsString, IsEmail, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';

export class QueryCustomerDto {
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  firstName?: string;

  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  lastName?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MaxLength(15, { message: 'Phone must not exceed 15 characters' })
  phone?: string;

  @IsString({ message: 'Company must be a string' })
  @IsOptional()
  @MaxLength(150, { message: 'Company must not exceed 150 characters' })
  company?: string;

  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean;
}

