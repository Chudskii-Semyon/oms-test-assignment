import { HttpException, HttpStatus } from '@nestjs/common';

export const COULD_NOT_CREATE_RECEIPT_ERROR =
    'COULD_NOT_CREATE_RECEIPT_ERROR';

export class CouldNotCreateReceiptError extends HttpException {
    constructor(message: string) {
        super(
            {
                message,
                status: COULD_NOT_CREATE_RECEIPT_ERROR,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
