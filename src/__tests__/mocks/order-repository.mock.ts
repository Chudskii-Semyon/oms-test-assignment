import { mockOrder } from './order.mock';

export const mockOrderRepository = {
    findOneOrFail: jest.fn().mockReturnValue(mockOrder),
    find: jest.fn().mockReturnValue([mockOrder]),
    create: jest.fn().mockReturnValue(mockOrder),
    save: jest.fn().mockReturnValue(mockOrder),
};
