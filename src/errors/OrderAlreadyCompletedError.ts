import { HttpException, HttpStatus } from '@nestjs/common';

export const ORDER_ALREADY_COMPLETED_ERROR =
    'ORDER_ALREADY_COMPLETED_ERROR';

export class OrderAlreadyCompletedError extends HttpException {
    constructor(message: string) {
        super(
            {
                message,
                status: ORDER_ALREADY_COMPLETED_ERROR,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
