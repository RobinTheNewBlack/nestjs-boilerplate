import { Injectable, NotFoundException } from '@nestjs/common';
import { SalesTransactionRepository } from '@/modules/sales-transaction/sales-transaction.repository';
import { CreateSalesTransactionDto } from '@/modules/sales-transaction/dto/create-sales-transaction.dto';
import { UpdateSalesTransactionDto } from '@/modules/sales-transaction/dto/update-sales-transaction.dto';
import { QuerySalesTransactionDto } from '@/modules/sales-transaction/dto/query-sales-transaction.dto';
import { ERROR_MESSAGES } from '@/common/constants/error-messages.constant';

@Injectable()
export class SalesTransactionService {
    constructor(private readonly salesTransactionRepository: SalesTransactionRepository) {}

    async createSalesTransaction(data: CreateSalesTransactionDto) {
        return await this.salesTransactionRepository.create(data);
    }

    async getAllSalesTransactions(query: QuerySalesTransactionDto) {
        return await this.salesTransactionRepository.findAll(query);
    }

    async getSalesTransactionById(uuid: string) {
        const transaction = await this.salesTransactionRepository.findById(uuid);
        if (!transaction) {
            throw new NotFoundException(ERROR_MESSAGES.SALES_TRANSACTION.NOT_FOUND(uuid));
        }
        return transaction;
    }

    async updateSalesTransaction(uuid: string, data: UpdateSalesTransactionDto) {
        await this.getSalesTransactionById(uuid);
        return await this.salesTransactionRepository.update(uuid, data);
    }

    async deleteSalesTransaction(uuid: string) {
        await this.getSalesTransactionById(uuid);
        return await this.salesTransactionRepository.delete(uuid);
    }
}
