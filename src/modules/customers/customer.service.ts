import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepository } from '@/modules/customers/customer.repository';
import { CreateCustomerDto } from '@/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/modules/customers/dto/update-customer.dto';
import { QueryCustomerDto } from '@/modules/customers/dto/query-customer.dto';
import { ERROR_MESSAGES } from '@/common/constants/error-messages.constant';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) { }

  async createCustomer(data: CreateCustomerDto) {
    if (!data.first_name || !data.last_name) {
      throw new BadRequestException(ERROR_MESSAGES.CUSTOMER.NAME_REQUIRED);
    }
    return await this.customerRepository.create(data);
  }

  async getAllCustomers(query: QueryCustomerDto) {
    return await this.customerRepository.findAll(query);
  }

  async getCustomerById(uuid: string) {
    const customer = await this.customerRepository.findById(uuid);
    if (!customer) {
      throw new NotFoundException(ERROR_MESSAGES.CUSTOMER.NOT_FOUND(uuid));
    }
    return customer;
  }

  async updateCustomer(uuid: string, data: UpdateCustomerDto) {
    const customer = await this.getCustomerById(uuid);
    if (!customer) {
      throw new NotFoundException(ERROR_MESSAGES.CUSTOMER.NOT_FOUND(uuid));
    }
    return await this.customerRepository.update(uuid, data);
  }

  async deleteCustomer(uuid: string) {
    const customer = await this.getCustomerById(uuid);
    if (!customer) {
      throw new NotFoundException(ERROR_MESSAGES.CUSTOMER.NOT_FOUND(uuid));
    }
    return await this.customerRepository.delete(uuid);
  }
}
