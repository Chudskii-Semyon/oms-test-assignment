import { HttpException, HttpStatus } from '@nestjs/common';

export const FORBIDDEN_RESOURCE_ERROR =
    'FORBIDDEN_RESOURCE_ERROR';

export class ForbiddenResourceError extends HttpException {
    constructor() {
        super(
            {
                message: `Dont have privileges to access this source`,
                status: FORBIDDEN_RESOURCE_ERROR,
            },
            HttpStatus.FORBIDDEN,
        );
    }
}
