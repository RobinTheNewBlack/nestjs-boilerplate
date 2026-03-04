import { PartialType } from '@nestjs/swagger';
import { CreateSalesTransactionItemDto } from './create-sales-transaction-item.dto';

export class UpdateSalesTransactionItemDto extends PartialType(CreateSalesTransactionItemDto) {}
