import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EmployeePositionEnum } from '@/common/enums';

export class QueryEmployeeDto {
  @MaxLength(50)
  @IsString()
  @IsOptional()
  employee_code?: string;

  @MaxLength(100)
  @IsString()
  @IsOptional()
  first_name?: string;

  @MaxLength(100)
  @IsString()
  @IsOptional()
  last_name?: string;

  @IsEnum(EmployeePositionEnum)
  @IsOptional()
  position?: EmployeePositionEnum;

  @MaxLength(255)
  @IsEmail()
  @IsOptional()
  email?: string;

  @MaxLength(15)
  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  is_active?: boolean;
}
