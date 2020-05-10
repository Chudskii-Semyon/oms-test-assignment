import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from '../receipt.controller';
import { ORDER_REPOSITORY_TOKEN } from '../../order/constants/order.constants';
import { mockOrderRepository } from '../../../__tests__/mocks/order-repository.mock';
import { RECEIPT_REPOSITORY_TOKEN } from '../constants/receipt.constant';
import { mockReceiptRepository } from '../../../__tests__/mocks/receipt-repository.mock';
import { ConfigModule } from '../../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../../entities/order.entity';
import { Receipt } from '../../../entities/receipt.entity';
import { ReceiptService } from '../receipt.service';
import { LoggerService } from '../../../logger/logger.service';
import { mockOrder } from '../../../__tests__/mocks/order.mock';
import { CreateReceiptDto } from '../DTOs/create-receipt.dto';
import { Request } from 'express';
import { mockEmployee } from '../../../__tests__/mocks/employee.mock';
import { mockReceipt } from '../../../__tests__/mocks/receipt.mock';
import { mockReceiptService } from './mocks/receipt-service.mock';

describe('Receipt Controller', () => {
    let controller: ReceiptController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule, TypeOrmModule.forFeature([Order, Receipt])],
            providers: [ReceiptService, LoggerService],
            controllers: [ReceiptController],
        })
            .overrideProvider(ReceiptService)
            .useValue(mockReceiptService)
            .overrideProvider(ORDER_REPOSITORY_TOKEN)
            .useValue(mockOrderRepository)
            .overrideProvider(RECEIPT_REPOSITORY_TOKEN)
            .useValue(mockReceiptRepository)
            .compile();

        controller = module.get<ReceiptController>(ReceiptController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createReceipt', () => {
        const args: CreateReceiptDto = { orderId: mockOrder.id };
        const req = { user: { id: mockEmployee.id } } as unknown as Request;

        it('should return created receipt', async () => {
            const mockReceiptServiceSpy = jest.spyOn(mockReceiptService, 'createReceipt');
            const result = await controller.createReceipt(args, req);

            expect(result).toEqual(mockReceipt);
            expect(mockReceiptServiceSpy).toBeCalledWith(args, mockEmployee.id);
        });
    });
});
