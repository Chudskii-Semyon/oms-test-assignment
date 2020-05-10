import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Employee } from '../../../entities/employee.entity';
import { EmployeeRoleEnum } from '../../../enums/employee-role.enum';
import { ForbiddenResourceError } from '../../../errors/ForbiddenResourceError';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<EmployeeRoleEnum[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const user: Employee = request.user;

        if (roles.includes(user.role) || user.role === EmployeeRoleEnum.ADMIN) {
            return true;
        }

        throw new ForbiddenResourceError();
    }
}
