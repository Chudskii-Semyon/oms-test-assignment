import { mockOrder } from '../../../../__tests__/mocks/order.mock';

export const mockOrderService = {
    getOrder: jest.fn().mockReturnValue(mockOrder),
    getOrders: jest.fn().mockReturnValue([mockOrder]),
    createOrder: jest.fn().mockReturnValue(mockOrder),
    updateOrderStatus: jest.fn().mockReturnValue(mockOrder),
};
