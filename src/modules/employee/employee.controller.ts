import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { EmployeeService } from '@/modules/employee/employee.service';
import { CreateEmployeeDto } from '@/modules/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@/modules/employee/dto/update-employee.dto';
import { QueryEmployeeDto } from '@/modules/employee/dto/query-employee.dto';

@Controller('employees')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() data: CreateEmployeeDto) {
        return this.employeeService.createEmployee(data);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(@Query() query: QueryEmployeeDto) {
        return this.employeeService.getAllEmployees(query);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
        return this.employeeService.getEmployeeById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: string, @Body() data: UpdateEmployeeDto) {
        return this.employeeService.updateEmployee(id, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.employeeService.deleteEmployee(id);
    }
}
