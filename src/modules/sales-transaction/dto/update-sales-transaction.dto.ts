import { PartialType } from '@nestjs/swagger';
import { CreateSalesTransactionDto } from './create-sales-transaction.dto';

export class UpdateSalesTransactionDto extends PartialType(CreateSalesTransactionDto) {}
