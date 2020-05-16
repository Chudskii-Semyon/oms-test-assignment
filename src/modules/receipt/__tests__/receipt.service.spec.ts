import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptService } from '../receipt.service';
import { LoggerService } from '../../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../../entities/order.entity';
import { Receipt } from '../../../entities/receipt.entity';
import { ConfigModule } from '../../../config/config.module';
import { ORDER_REPOSITORY_TOKEN } from '../../order/constants/order.constants';
import { mockOrderRepository } from '../../../__tests__/mocks/order-repository.mock';
import { RECEIPT_REPOSITORY_TOKEN } from '../constants/receipt.constant';
import { mockReceiptRepository } from '../../../__tests__/mocks/receipt-repository.mock';
import { mockOrder } from '../../../__tests__/mocks/order.mock';
import { CreateReceiptDto } from '../DTOs/create-receipt.dto';
import { mockEmployee } from '../../../__tests__/mocks/employee.mock';
import { mockReceipt } from '../../../__tests__/mocks/receipt.mock';
import { RECEIPT_ALREADY_EXISTS_ERROR } from '../../../errors/ReceiptAlreadyExistsError';
import { ORDER_NOT_FOUND_ERROR } from '../../../errors/OrderNotFoundError';
import { COULD_NOT_CREATE_RECEIPT_ERROR } from '../../../errors/CouldNotCreateReceiptError';
import { OrderStatusEnum } from '../../../enums/order-status.enum';

describe('ReceiptService', () => {
    let service: ReceiptService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule, TypeOrmModule.forFeature([Order, Receipt])],
            providers: [ReceiptService, LoggerService],
        })
            .overrideProvider(ORDER_REPOSITORY_TOKEN)
            .useValue(mockOrderRepository)
            .overrideProvider(RECEIPT_REPOSITORY_TOKEN)
            .useValue(mockReceiptRepository)
            .compile();

        service = module.get<ReceiptService>(ReceiptService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createReceipt', () => {
        const args: CreateReceiptDto = { orderId: mockOrder.id };
        const mockCompletedOrder = {
            ...mockOrder,
            status: OrderStatusEnum.COMPLETED,
        };

        it('should create and return receipt', async () => {
            const mockOrderRepositorySpy = jest.spyOn(mockOrderRepository, 'findOneOrFail')
                .mockReturnValue(mockCompletedOrder);
            const mockReceiptRepositoryCreateSpy = jest.spyOn(mockReceiptRepository, 'create');
            const mockReceiptRepositorySaveSpy = jest.spyOn(mockReceiptRepository, 'save');
            const mockReceiptRepositoryFindOneSpy = jest.spyOn(mockReceiptRepository, 'findOne')
                .mockReturnValue(null);

            const findOrderQuery = {
                id: mockOrder.id,
                cashierId: mockEmployee.id,
            };
            const findReceiptQuery = {
                where: {
                    order: { id: mockOrder.id },
                },
            };

            const createReceipt = {
                order: {id: mockOrder.id},
                total: mockOrder.total,
                discount: mockOrder.discount,
                product: mockOrder.product,
                orderCreatedAt: mockOrder.createdAt,
            };
            const result = await service.createReceipt(args, mockEmployee.id);

            expect(result).toEqual(mockReceipt);
            expect(mockOrderRepositorySpy).toBeCalledWith(findOrderQuery);
            expect(mockReceiptRepositoryFindOneSpy).toBeCalledWith(findReceiptQuery);
            expect(mockReceiptRepositoryCreateSpy).toBeCalledWith(createReceipt);
            expect(mockReceiptRepositorySaveSpy).toBeCalledWith(mockReceipt);
        });

        it('should throw RECEIPT_ALREADY_EXISTS_ERROR if receipt was found', async () => {
            jest.spyOn(mockReceiptRepository, 'findOne')
                .mockImplementation(() => mockReceipt);

            try {
                await service.createReceipt(args, mockEmployee.id);

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(RECEIPT_ALREADY_EXISTS_ERROR);
            }
        });

        it('should throw ORDER_NOT_FOUND_ERROR if order was not found', async () => {
            jest.spyOn(mockReceiptRepository, 'findOne')
                .mockImplementation(() => null);
            jest.spyOn(mockOrderRepository, 'findOneOrFail')
                .mockImplementation(() => {
                    throw new Error();
                });

            try {
                await service.createReceipt(args, mockEmployee.id);

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(ORDER_NOT_FOUND_ERROR);
            }
        });

        it('should throw COULD_NOT_CREATE_RECEIPT_ERROR if error occurred on receipt saving', async () => {
            jest.spyOn(mockReceiptRepository, 'findOne')
                .mockImplementation(() => null);
            jest.spyOn(mockOrderRepository, 'findOneOrFail')
                .mockReturnValue(mockCompletedOrder);
            jest.spyOn(mockReceiptRepository, 'save')
                .mockImplementation(() => {
                    throw new Error();
                });

            try {
                await service.createReceipt(args, mockEmployee.id);

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(COULD_NOT_CREATE_RECEIPT_ERROR);
            }
        });

        it('should throw COULD_NOT_CREATE_RECEIPT_ERROR if error occurred on receipt creation', async () => {
            jest.spyOn(mockReceiptRepository, 'findOne')
                .mockImplementation(() => null);
            jest.spyOn(mockOrderRepository, 'findOneOrFail')
                .mockReturnValue(mockCompletedOrder);
            jest.spyOn(mockReceiptRepository, 'create')
                .mockImplementation(() => {
                    throw new Error();
                });

            try {
                await service.createReceipt(args, mockEmployee.id);

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(COULD_NOT_CREATE_RECEIPT_ERROR);
            }
        });
    });
});
