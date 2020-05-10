import { mockProduct } from './product.mock';
import { Receipt } from '../../entities/receipt.entity';

export const mockReceipt = {
    total: 10,
    discount: 0,
    orderCreatedAt: new Date(),
    product: mockProduct,
    id: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
    productId: 1,
} as Receipt;
