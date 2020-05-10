import { mockReceipt } from './receipt.mock';

export const mockReceiptRepository = {
    findOneOrFail: jest.fn().mockReturnValue(mockReceipt),
    findOne: jest.fn().mockReturnValue(mockReceipt),
    create: jest.fn().mockReturnValue(mockReceipt),
    save: jest.fn().mockReturnValue(mockReceipt),
};
