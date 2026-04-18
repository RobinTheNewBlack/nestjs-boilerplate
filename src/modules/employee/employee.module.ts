import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { EmployeeController } from '@/modules/employee/employee.controller';
import { EmployeeService } from '@/modules/employee/employee.service';
import { EmployeeRepository } from '@/modules/employee/employee.repository';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
