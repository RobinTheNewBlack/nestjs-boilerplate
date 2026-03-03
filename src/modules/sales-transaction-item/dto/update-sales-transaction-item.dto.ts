import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesTransactionItemDto } from './create-sales-transaction-item.dto';

export class UpdateSalesTransactionItemDto extends PartialType(CreateSalesTransactionItemDto) {}
