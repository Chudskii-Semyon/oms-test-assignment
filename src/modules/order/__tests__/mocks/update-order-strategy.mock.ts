export const mockUpdateOrderContext = {
    setStrategy: jest.fn(),
    checkAccess: jest.fn(),
    updateOrder: jest.fn(),
};

export const mockUpdateOrderStatusToCompletedStrategy = {
    setContext: jest.fn(),
    checkAccess: jest.fn(),
    updateOrder: jest.fn(),
};

export const mockUpdateOrderStatusToPaidStrategy = {
    setContext: jest.fn(),
    checkAccess: jest.fn(),
    updateOrder: jest.fn(),
};
