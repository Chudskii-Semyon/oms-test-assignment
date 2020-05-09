import { HttpException, HttpStatus } from '@nestjs/common';

export const EMPLOYEE_NOT_FOUND_ERROR =
    'EMPLOYEE_NOT_FOUND_ERROR';

export class EmployeeNotFoundError extends HttpException {
    constructor(message: string) {
        super(
            {
                message,
                status: EMPLOYEE_NOT_FOUND_ERROR,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
