import { HttpException, HttpStatus } from '@nestjs/common';

export const RECEIPT_ALREADY_EXISTS_ERROR =
    'RECEIPT_ALREADY_EXISTS_ERROR';

export class ReceiptAlreadyExistsError extends HttpException {
    constructor(message: string) {
        super(
            {
                message,
                status: RECEIPT_ALREADY_EXISTS_ERROR,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
