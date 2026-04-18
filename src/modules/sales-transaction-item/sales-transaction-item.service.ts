import { Injectable, NotFoundException } from '@nestjs/common';
import { SalesTransactionItemRepository } from '@/modules/sales-transaction-item/sales-transaction-item.repository';
import { CreateSalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/create-sales-transaction-item.dto';
import { UpdateSalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/update-sales-transaction-item.dto';
import { QuerySalesTransactionItemDto } from '@/modules/sales-transaction-item/dto/query-sales-transaction-item.dto';
import { ERROR_MESSAGES } from '@/common/constants/error-messages.constant';

@Injectable()
export class SalesTransactionItemService {
  constructor(
    private readonly salesTransactionItemRepository: SalesTransactionItemRepository,
  ) {}

  async createSalesTransactionItem(data: CreateSalesTransactionItemDto) {
    return await this.salesTransactionItemRepository.create(data);
  }

  async getAllSalesTransactionItems(query: QuerySalesTransactionItemDto) {
    return await this.salesTransactionItemRepository.findAll(query);
  }

  async getSalesTransactionItemById(uuid: string) {
    const item = await this.salesTransactionItemRepository.findById(uuid);
    if (!item) {
      throw new NotFoundException(
        ERROR_MESSAGES.SALES_TRANSACTION_ITEM.NOT_FOUND(uuid),
      );
    }
    return item;
  }

  async updateSalesTransactionItem(
    uuid: string,
    data: UpdateSalesTransactionItemDto,
  ) {
    await this.getSalesTransactionItemById(uuid);
    return await this.salesTransactionItemRepository.update(uuid, data);
  }

  async deleteSalesTransactionItem(uuid: string) {
    await this.getSalesTransactionItemById(uuid);
    return await this.salesTransactionItemRepository.delete(uuid);
  }
}
