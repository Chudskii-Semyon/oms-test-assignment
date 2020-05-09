import { EmployeeRoleEnum } from '../../enums/employee-role.enum';
import { Employee } from '../../entities/employee.entity';

export const mockEmployee = {
    id: 1,
    name: 'mock',
    email: 'mock@mail.com',
    password: 'mock password',
    role: EmployeeRoleEnum.CASHIER,
} as Employee;
