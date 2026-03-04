import {
    IsString,
    IsEmail,
    IsBoolean,
    IsOptional,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeePositionEnum } from '@/common/enums';

export class CreateEmployeeDto {
    @ApiProperty({ example: 'EMP001' })
    @MaxLength(50, { message: 'Employee code must not exceed 50 characters' })
    @MinLength(3, { message: 'Employee code must be at least 3 characters' })
    @IsString({ message: 'Employee code must be a string' })
    @IsNotEmpty({ message: 'Employee code must not be empty' })
    employee_code: string;

    @ApiProperty({ example: 'John' })
    @MaxLength(100, { message: 'First name must not exceed 100 characters' })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name must not be empty' })
    first_name: string;

    @ApiProperty({ example: 'Doe' })
    @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name must not be empty' })
    last_name: string;

    @ApiProperty({ example: EmployeePositionEnum.CASHIER, enum: EmployeePositionEnum })
    @IsEnum(EmployeePositionEnum, { message: 'Position must be a valid enum value' })
    @IsNotEmpty({ message: 'Position must not be empty' })
    position: EmployeePositionEnum;

    @ApiPropertyOptional({ example: '0812345678' })
    @MaxLength(15, { message: 'Phone must not exceed 15 characters' })
    @IsString({ message: 'Phone must be a string' })
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    @MaxLength(255, { message: 'Email must not exceed 255 characters' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsOptional()
    email?: string;

    @ApiProperty({ example: '2024-01-15' })
    @IsDateString({}, { message: 'Hire date must be a valid ISO 8601 date string' })
    @IsNotEmpty({ message: 'Hire date must not be empty' })
    hire_date: string;

    @ApiPropertyOptional({ example: true })
    @IsBoolean({ message: 'is_active must be a boolean value' })
    @IsOptional()
    is_active?: boolean;
}
