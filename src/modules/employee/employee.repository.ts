import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateEmployeeDto } from '@/modules/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@/modules/employee/dto/update-employee.dto';
import { QueryEmployeeDto } from '@/modules/employee/dto/query-employee.dto';

@Injectable()
export class EmployeeRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateEmployeeDto) {
        return await this.prisma.employee.create({ data });
    }

    async findAll(query: QueryEmployeeDto) {
        return await this.prisma.employee.findMany({ where: query });
    }

    async findById(uuid: string) {
        return await this.prisma.employee.findUnique({ where: { uuid } });
    }

    async update(uuid: string, data: UpdateEmployeeDto) {
        return await this.prisma.employee.update({ where: { uuid }, data });
    }

    async delete(uuid: string) {
        return await this.prisma.employee.delete({ where: { uuid } });
    }
}
