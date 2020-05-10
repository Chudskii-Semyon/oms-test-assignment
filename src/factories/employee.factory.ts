import { define } from 'typeorm-seeding';
import { Employee } from '../entities/employee.entity';
import { EmployeeRoleEnum } from '../enums/employee-role.enum';

const { CASHIER, ACCOUNTANT, ADMIN, SHOP_ASSISTANT } = EmployeeRoleEnum;

define(Employee, faker => {
    // @ts-ignore
    const employee = new Employee();

    employee.name = faker.name.firstName();
    employee.email = faker.internet.email();
    employee.password = '123456';
    employee.role = faker.random.arrayElement([CASHIER, ACCOUNTANT, ADMIN, SHOP_ASSISTANT]);

    return employee;
});
