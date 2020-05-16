import { mockEmployee } from './employee.mock';

export const mockEmployeeRepository = {
    findOneOrFail: jest.fn().mockReturnValue(mockEmployee),
};
