import { mockReceipt } from '../../../../__tests__/mocks/receipt.mock';

export const mockReceiptService = {
    createReceipt: jest.fn().mockReturnValue(mockReceipt),
};
