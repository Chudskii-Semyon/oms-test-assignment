import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../../entities/employee.entity';
import { Repository } from 'typeorm';
import { EmployeeDto } from './DTOs/employee.dto';

@Injectable()
export class EmployeeService {
    constructor(
        private readonly loggerService: LoggerService,
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>
    ) {
    }

    public async getEmployeeByEmailAndPassword(email: string, password: string): Promise<EmployeeDto> {
        try {
            const hashedPassword =
            const employee: EmployeeDto = this.employeeRepository.find()
        }
    }
}
