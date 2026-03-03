import { IsString, IsEmail, IsBoolean, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { EmployeePositionEnum } from '@/common/enums';

export class QueryEmployeeDto {
    @IsString()
    @IsOptional()
    @MaxLength(50)
    employee_code?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    first_name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    last_name?: string;

    @IsEnum(EmployeePositionEnum)
    @IsOptional()
    position?: EmployeePositionEnum;

    @IsEmail()
    @IsOptional()
    @MaxLength(255)
    email?: string;

    @IsString()
    @IsOptional()
    @MaxLength(15)
    phone?: string;

    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    is_active?: boolean;
}
