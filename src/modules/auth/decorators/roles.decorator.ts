import { SetMetadata } from '@nestjs/common';
import { EmployeeRoleEnum } from '../../../enums/employee-role.enum';

export const Roles = (...roles: EmployeeRoleEnum[]) => SetMetadata('roles', roles);
