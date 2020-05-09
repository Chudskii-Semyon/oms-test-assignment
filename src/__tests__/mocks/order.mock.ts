import { Order } from '../../entities/order.entity';
import { mockProduct } from './product.mock';

export const mockOrder = {
    id: 1,
    discount: 0,
    total: 10,
    status: 'CREATED',
    createdAt: new Date(),
    updatedAt: new Date(),
    product: mockProduct,
    cashierId: 1,
} as Order;
