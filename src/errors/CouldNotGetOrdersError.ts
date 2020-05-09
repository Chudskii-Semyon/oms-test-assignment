import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_GET_ORDERS_ERROR =
    'COULD_NOT_GET_ORDERS_ERROR';

export class CouldNotGetOrdersError extends HttpException {
    constructor(message: string) {
        super(
            {
                message,
                status: COULD_NOT_GET_ORDERS_ERROR,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
