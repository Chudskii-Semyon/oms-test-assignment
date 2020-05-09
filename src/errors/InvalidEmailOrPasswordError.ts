import { HttpException, HttpStatus } from '@nestjs/common';

export const INVALID_EMAIL_OR_PASSWORD_ERROR =
    'INVALID_EMAIL_OR_PASSWORD_ERROR';

export class InvalidEmailOrPasswordError extends HttpException {
    constructor() {
        super(
            {
                message: 'Invalid email or password',
                status: INVALID_EMAIL_OR_PASSWORD_ERROR,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
