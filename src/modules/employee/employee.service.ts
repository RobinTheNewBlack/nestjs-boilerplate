import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeRepository } from '@/modules/employee/employee.repository';
import { CreateEmployeeDto } from '@/modules/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@/modules/employee/dto/update-employee.dto';
import { QueryEmployeeDto } from '@/modules/employee/dto/query-employee.dto';
import { ERROR_MESSAGES } from '@/common/constants';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async createEmployee(data: CreateEmployeeDto) {
    return await this.employeeRepository.create(data);
  }

  async getAllEmployees(query: QueryEmployeeDto) {
    return await this.employeeRepository.findAll(query);
  }

  async getEmployeeById(uuid: string) {
    const employee = await this.employeeRepository.findById(uuid);
    if (!employee) {
      throw new NotFoundException(ERROR_MESSAGES.EMPLOYEE.NOT_FOUND(uuid));
    }
    return employee;
  }

  async updateEmployee(uuid: string, data: UpdateEmployeeDto) {
    await this.getEmployeeById(uuid);
    return await this.employeeRepository.update(uuid, data);
  }

  async deleteEmployee(uuid: string) {
    await this.getEmployeeById(uuid);
    return await this.employeeRepository.delete(uuid);
  }
}
