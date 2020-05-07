import { EmployeeRoleEnum } from '../../../enums/employee-role.enum';

export interface EmployeeDto {
    id: number;
    role: EmployeeRoleEnum;
    name: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
