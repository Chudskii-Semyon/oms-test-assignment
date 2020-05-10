import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_UPDATE_ORDER_ERROR =
    'COULD_NOT_UPDATE_ORDER_ERROR';

export class CouldNotUpdateOrderError extends HttpException {
    constructor(message: string) {
        super(
            {
                message,
                status: COULD_NOT_UPDATE_ORDER_ERROR,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
