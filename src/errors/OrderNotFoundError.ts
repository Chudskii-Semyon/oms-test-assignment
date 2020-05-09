import { HttpException, HttpStatus } from '@nestjs/common';

export const ORDER_NOT_FOUND_ERROR =
    'ORDER_NOT_FOUND_ERROR';

export class OrderNotFoundError extends HttpException {
    constructor(message: string) {
        super(
            {
                message,
                status: ORDER_NOT_FOUND_ERROR,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
