import { HttpException, HttpStatus } from '@nestjs/common';

export const ORDER_NOT_COMPLETED_ERROR =
    'ORDER_NOT_COMPLETED_ERROR';

export class OrderNotCompletedError extends HttpException {
    constructor(message: string) {
        super(
            {
                message,
                status: ORDER_NOT_COMPLETED_ERROR,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
