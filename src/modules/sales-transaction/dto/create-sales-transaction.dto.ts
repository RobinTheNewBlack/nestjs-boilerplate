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
import { PaymentMethodEnum, PaymentStatusEnum, TransactionStatusEnum } from '@/common/enums';

export class CreateSalesTransactionDto {
    @IsDateString({}, { message: 'Sale date must be a valid ISO 8601 date string' })
    @IsNotEmpty({ message: 'Sale date must not be empty' })
    sale_date: string;

    @IsUUID('4', { message: 'Customer UUID must be a valid UUID' })
    @IsNotEmpty({ message: 'Customer UUID must not be empty' })
    customer_uuid: string;

    @IsUUID('4', { message: 'Employee UUID must be a valid UUID' })
    @IsNotEmpty({ message: 'Employee UUID must not be empty' })
    employee_uuid: string;

    @IsNumber({}, { message: 'Subtotal must be a number' })
    @Min(0, { message: 'Subtotal must be at least 0' })
    subtotal: number;

    @IsNumber({}, { message: 'Tax amount must be a number' })
    @Min(0, { message: 'Tax amount must be at least 0' })
    tax_amount: number;

    @IsNumber({}, { message: 'Discount amount must be a number' })
    @Min(0, { message: 'Discount amount must be at least 0' })
    discount_amount: number;

    @IsNumber({}, { message: 'Total amount must be a number' })
    @Min(0, { message: 'Total amount must be at least 0' })
    total_amount: number;

    @IsEnum(PaymentMethodEnum, { message: 'Payment method must be a valid enum value' })
    @IsNotEmpty({ message: 'Payment method must not be empty' })
    payment_method: PaymentMethodEnum;

    @IsEnum(PaymentStatusEnum, { message: 'Payment status must be a valid enum value' })
    @IsNotEmpty({ message: 'Payment status must not be empty' })
    payment_status: PaymentStatusEnum;

    @IsDateString({}, { message: 'Due date must be a valid ISO 8601 date string' })
    @IsOptional()
    due_date?: string;

    @IsEnum(TransactionStatusEnum, { message: 'Status must be a valid enum value' })
    @IsNotEmpty({ message: 'Status must not be empty' })
    status: TransactionStatusEnum;

    @IsString()
    @IsOptional()
    notes?: string;
}
