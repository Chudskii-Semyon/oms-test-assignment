import { HttpException, HttpStatus } from '@nestjs/common';

export const PRODUCT_NOT_FOUND_ERROR =
    'PRODUCT_NOT_FOUND_ERROR';

export class ProductNotFoundError extends HttpException {
    constructor(message: string) {
        super(
            {
                message,
                status: PRODUCT_NOT_FOUND_ERROR,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
