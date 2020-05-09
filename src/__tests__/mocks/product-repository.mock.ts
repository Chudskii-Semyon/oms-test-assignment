import { mockProduct } from './product.mock';

export const mockProductRepository = {
    findOneOrFail: jest.fn().mockReturnValue(mockProduct),
};
