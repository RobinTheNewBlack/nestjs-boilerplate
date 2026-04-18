import {
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryInventoryDto {
  @IsUUID('4')
  @IsOptional()
  product_uuid?: string;

  @MaxLength(100)
  @IsString()
  @IsOptional()
  warehouse_name?: string;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  is_active?: boolean;
}
