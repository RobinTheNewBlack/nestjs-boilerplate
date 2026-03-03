import { IsOptional, IsUUID } from 'class-validator';

export class QuerySalesTransactionItemDto {
    @IsUUID('4')
    @IsOptional()
    sale_uuid?: string;

    @IsUUID('4')
    @IsOptional()
    product_uuid?: string;
}
