import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { LoggerService } from '../../../logger/logger.service';
import { ConfigModule } from '../../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../../entities/order.entity';
import { Product } from '../../../entities/product.entity';
import { PRODUCT_REPOSITORY_TOKEN } from '../../product/constants/product.constant';
import { ORDER_REPOSITORY_TOKEN } from '../constants/order.constants';
import { ORDER_NOT_FOUND_ERROR } from '../../../errors/OrderNotFoundError';
import { Between } from 'typeorm';
import { COULD_NOT_GET_ORDERS_ERROR } from '../../../errors/CouldNotGetOrdersError';
import { GetOrderDto } from '../DTOs/get-order.dto';
import { GetOrdersDto } from '../DTOs/get-orders.dto';
import { CreateOrderDto } from '../DTOs/create-order.dto';
import { OrderStatusEnum } from '../../../enums/order-status.enum';
import { PRODUCT_NOT_FOUND_ERROR } from '../../../errors/ProductNotFoundError';
import { mockOrder } from '../../../__tests__/mocks/order.mock';
import { mockProduct } from '../../../__tests__/mocks/product.mock';
import { mockEmployee } from '../../../__tests__/mocks/employee.mock';
import { mockOrderRepository } from '../../../__tests__/mocks/order-repository.mock';
import { mockProductRepository } from '../../../__tests__/mocks/product-repository.mock';
import { COULD_NOT_CREATE_ORDER_ERROR } from '../../../errors/CouldNotCreateOrderError';

describe('OrderService', () => {
    let service: OrderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule,
                TypeOrmModule.forFeature([Order, Product]),
            ],
            providers: [
                OrderService,
                LoggerService,
            ],
        })
            .overrideProvider(ORDER_REPOSITORY_TOKEN)
            .useValue(mockOrderRepository)
            .overrideProvider(PRODUCT_REPOSITORY_TOKEN)
            .useValue(mockProductRepository)
            .compile();

        service = module.get<OrderService>(OrderService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    describe('getOrder', () => {
        const args: GetOrderDto = { orderId: mockOrder.id };

        it('should return order', async () => {
            const mockOrderRepositorySpy = jest.spyOn(mockOrderRepository, 'findOneOrFail');

            const query = { id: mockOrder.id };

            const result = await service.getOrder(args);

            expect(result).toEqual(mockOrder);
            expect(mockOrderRepositorySpy).toBeCalledWith(query);
        });

        it('should throw ORDER_NOT_FOUND_ERROR if order was not found', async () => {
            jest.spyOn(mockOrderRepository, 'findOneOrFail')
                .mockImplementation(() => {
                    throw new Error();
                });

            try {
                await service.getOrder(args);

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(ORDER_NOT_FOUND_ERROR);
            }
        });
    });

    describe('getOrders', () => {
        const start = new Date().toISOString();
        const end = new Date().toISOString();
        const args: GetOrdersDto = { start, end };

        it('should return orders', async () => {
            const mockOrderRepositorySpy = jest.spyOn(mockOrderRepository, 'find');

            const query = { createdAt: Between(start, end) };

            const result = await service.getOrders(args);

            expect(result).toEqual([mockOrder]);
            expect(mockOrderRepositorySpy).toBeCalledWith(query);
        });

        it('should throw COULD_NOT_GET_ORDERS_ERROR if error occurred', async () => {
            jest.spyOn(mockOrderRepository, 'find')
                .mockImplementation(() => {
                    throw new Error();
                });

            try {
                await service.getOrders(args);

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(COULD_NOT_GET_ORDERS_ERROR);
            }
        });
    });

    describe('createOrder', () => {
        const args: CreateOrderDto = { productId: mockProduct.id };
        const productId = mockProduct.id;
        const { discount, total } = mockOrder;
        const cashierId = mockEmployee.id;

        it('should create and return order', async () => {
            const mockOrderRepositoryCreateSpy = jest.spyOn(mockOrderRepository, 'create');
            const mockOrderRepositorySaveSpy = jest.spyOn(mockOrderRepository, 'save');
            const mockProductRepositorySpy = jest.spyOn(mockProductRepository, 'findOneOrFail');

            const findProductQuery = { id: productId };
            const createOrderQuery = {
                product: mockProduct,
                discount,
                cashierId,
                total,
                status: OrderStatusEnum.CREATED,
            } as Order;

            const result = await service.createOrder(args, cashierId);

            expect(result).toEqual(mockOrder);
            expect(mockProductRepositorySpy).toBeCalledWith(findProductQuery);
            expect(mockOrderRepositoryCreateSpy).toBeCalledWith(createOrderQuery);
            expect(mockOrderRepositorySaveSpy).toBeCalledWith(mockOrder);
        });

        it('should throw PRODUCT_NOT_FOUND_ERROR if project was not found', async () => {
            jest.spyOn(mockProductRepository, 'findOneOrFail')
                .mockImplementation(() => {
                    throw new Error();
                });

            try {
                await service.createOrder(args, cashierId);

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(PRODUCT_NOT_FOUND_ERROR);
            }
        });

        it('should throw COULD_NOT_CREATE_ORDER_ERROR if error occurred', async () => {
            jest.spyOn(mockProductRepository, 'findOneOrFail')
                .mockImplementation(() => mockProduct);
            jest.spyOn(mockOrderRepository, 'create')
                .mockImplementation(() => {
                    throw  new Error();
                });

            try {
                await service.createOrder(args, cashierId);

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(COULD_NOT_CREATE_ORDER_ERROR);
            }
        });
    });
});
