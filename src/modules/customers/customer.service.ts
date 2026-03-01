import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepository } from '@/modules/customers/customer.repository';
import { CreateCustomerDto } from '@/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/modules/customers/dto/update-customer.dto';
import { QueryCustomerDto } from '@/modules/customers/dto/query-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) { }

  async createCustomer(data: CreateCustomerDto) {
    if (!data.firstName || !data.lastName) {
      throw new BadRequestException('ชื่อและนามสกุลไม่สามารถเป็นค่าว่างได้');
    }
    return await this.customerRepository.create(data);
  }

  async getAllCustomers(query) {
    return await this.customerRepository.findAll(query);
  }

  async getCustomerById(id: number) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`ไม่พบลูกค้า ID: ${id}`);
    }
    return customer;
  }

  async updateCustomer(id: number, data: UpdateCustomerDto) {
    const customer = await this.getCustomerById(id);
    if (!customer) {
      throw new NotFoundException(`ไม่พบลูกค้า ID: ${id}`);
    }
    return await this.customerRepository.update(id, data);
  }

  async deleteCustomer(id: number) {
    const customer = await this.getCustomerById(id);
    if (!customer) {
      throw new NotFoundException(`ไม่พบลูกค้า ID: ${id}`);
    }
    return await this.customerRepository.delete(id);
  }
}
