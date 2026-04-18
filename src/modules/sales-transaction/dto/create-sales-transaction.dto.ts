import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PaymentMethodEnum,
  PaymentStatusEnum,
  TransactionStatusEnum,
} from '@/common/enums';

export class CreateSalesTransactionDto {
  @ApiProperty({ example: '2024-03-01' })
  @IsDateString(
    {},
    { message: 'Sale date must be a valid ISO 8601 date string' },
  )
  @IsNotEmpty({ message: 'Sale date must not be empty' })
  sale_date: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID('4', { message: 'Customer UUID must be a valid UUID' })
  @IsNotEmpty({ message: 'Customer UUID must not be empty' })
  customer_uuid: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID('4', { message: 'Employee UUID must be a valid UUID' })
  @IsNotEmpty({ message: 'Employee UUID must not be empty' })
  employee_uuid: string;

  @ApiProperty({ example: 798.0 })
  @Min(0, { message: 'Subtotal must be at least 0' })
  @IsNumber({}, { message: 'Subtotal must be a number' })
  subtotal: number;

  @ApiProperty({ example: 56.0 })
  @Min(0, { message: 'Tax amount must be at least 0' })
  @IsNumber({}, { message: 'Tax amount must be a number' })
  tax_amount: number;

  @ApiProperty({ example: 0 })
  @Min(0, { message: 'Discount amount must be at least 0' })
  @IsNumber({}, { message: 'Discount amount must be a number' })
  discount_amount: number;

  @ApiProperty({ example: 854.0 })
  @Min(0, { message: 'Total amount must be at least 0' })
  @IsNumber({}, { message: 'Total amount must be a number' })
  total_amount: number;

  @ApiProperty({ example: PaymentMethodEnum.CASH, enum: PaymentMethodEnum })
  @IsEnum(PaymentMethodEnum, {
    message: 'Payment method must be a valid enum value',
  })
  @IsNotEmpty({ message: 'Payment method must not be empty' })
  payment_method: PaymentMethodEnum;

  @ApiProperty({ example: PaymentStatusEnum.PAID, enum: PaymentStatusEnum })
  @IsEnum(PaymentStatusEnum, {
    message: 'Payment status must be a valid enum value',
  })
  @IsNotEmpty({ message: 'Payment status must not be empty' })
  payment_status: PaymentStatusEnum;

  @ApiPropertyOptional({ example: '2024-03-15' })
  @IsDateString(
    {},
    { message: 'Due date must be a valid ISO 8601 date string' },
  )
  @IsOptional()
  due_date?: string;

  @ApiProperty({
    example: TransactionStatusEnum.COMPLETED,
    enum: TransactionStatusEnum,
  })
  @IsEnum(TransactionStatusEnum, {
    message: 'Status must be a valid enum value',
  })
  @IsNotEmpty({ message: 'Status must not be empty' })
  status: TransactionStatusEnum;

  @ApiPropertyOptional({ example: 'Customer requested gift wrapping' })
  @IsString()
  @IsOptional()
  notes?: string;
}
