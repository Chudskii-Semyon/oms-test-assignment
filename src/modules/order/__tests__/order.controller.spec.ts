import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { OrderController } from '../order.controller';
import { LoggerService } from '../../../logger/logger.service';
import { OrderService } from '../order.service';
import { ConfigModule } from '../../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../../entities/order.entity';
import { Product } from '../../../entities/product.entity';
import { ORDER_REPOSITORY_TOKEN } from '../constants/order.constants';
import { mockOrderRepository } from '../../../__tests__/mocks/order-repository.mock';
import { PRODUCT_REPOSITORY_TOKEN } from '../../product/constants/product.constant';
import { mockProductRepository } from '../../../__tests__/mocks/product-repository.mock';
import { GetOrderDto } from '../DTOs/get-order.dto';
import { mockOrder } from '../../../__tests__/mocks/order.mock';
import { mockOrderService } from './mocks/order-service.mock';
import { GetOrdersDto } from '../DTOs/get-orders.dto';
import { CreateOrderDto } from '../DTOs/create-order.dto';
import { mockProduct } from '../../../__tests__/mocks/product.mock';
import { mockEmployee } from '../../../__tests__/mocks/employee.mock';

describe('Order Controller', () => {
    let controller: OrderController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule,
                TypeOrmModule.forFeature([Order, Product]),
            ],
            controllers: [OrderController],
            providers: [LoggerService, OrderService],
        })
            .overrideProvider(ORDER_REPOSITORY_TOKEN)
            .useValue(mockOrderRepository)
            .overrideProvider(PRODUCT_REPOSITORY_TOKEN)
            .useValue(mockProductRepository)
            .overrideProvider(OrderService)
            .useValue(mockOrderService)
            .compile();

        controller = module.get<OrderController>(OrderController);

    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getOrder', () => {
        const args: GetOrderDto = { orderId: mockOrder.id };

        it('should return order', async () => {
            const orderServiceSpy = jest.spyOn(mockOrderService, 'getOrder');

            const result = await controller.getOrder(args);

            expect(result).toEqual(mockOrder);
            expect(orderServiceSpy).toBeCalledWith(args);
        });
    });

    describe('getOrders', () => {
        const start = new Date().toISOString();
        const end = new Date().toISOString();
        const args: GetOrdersDto = { start, end };

        it('should return orders', async () => {
            const orderServiceSpy = jest.spyOn(mockOrderService, 'getOrders');

            const result = await controller.getOrders(args);

            expect(result).toEqual([mockOrder]);
            expect(orderServiceSpy).toBeCalledWith(args);
        });
    });

    describe('createOrder', () => {
        const args: CreateOrderDto = { productId: mockProduct.id };
        const mockRequest = { user: { id: mockEmployee.id } } as unknown as Request;

        it('should return orders', async () => {
            const orderServiceSpy = jest.spyOn(mockOrderService, 'createOrder');

            const result = await controller.createOrder(args, mockRequest);

            expect(result).toEqual(mockOrder);
            expect(orderServiceSpy).toBeCalledWith(args, mockEmployee.id);
        });
    });
});
