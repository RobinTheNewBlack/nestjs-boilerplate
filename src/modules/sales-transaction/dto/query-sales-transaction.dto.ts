import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import {
  PaymentMethodEnum,
  PaymentStatusEnum,
  TransactionStatusEnum,
} from '@/common/enums';

export class QuerySalesTransactionDto {
  @IsUUID('4')
  @IsOptional()
  customer_uuid?: string;

  @IsUUID('4')
  @IsOptional()
  employee_uuid?: string;

  @IsEnum(PaymentMethodEnum)
  @IsOptional()
  payment_method?: PaymentMethodEnum;

  @IsEnum(PaymentStatusEnum)
  @IsOptional()
  payment_status?: PaymentStatusEnum;

  @IsEnum(TransactionStatusEnum)
  @IsOptional()
  status?: TransactionStatusEnum;
}
