import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from '../../entities/receipt.entity';
import { Repository } from 'typeorm';
import { CreateReceiptDto } from './DTOs/create-receipt.dto';
import { ReceiptAlreadyExistsError } from '../../errors/ReceiptAlreadyExistsError';
import { Order } from '../../entities/order.entity';
import { OrderNotFoundError } from '../../errors/OrderNotFoundError';
import { CouldNotCreateReceiptError } from '../../errors/CouldNotCreateReceiptError';

@Injectable()
export class ReceiptService {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        @InjectRepository(Receipt)
        private readonly receiptRepository: Repository<Receipt>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {
    }

    public async createReceipt(
        createReceiptInput: CreateReceiptDto,
        employeeId: number,
    ): Promise<Receipt> {
        const method = 'createReceipt';
        const { orderId } = createReceiptInput;

        let receipt: Receipt;

        receipt = await this.receiptRepository.findOne({ orderId });

        if (receipt) {
            const errorMessage = `Receipt for order with id: ${orderId} already exists!`;
            this.logger.error({
                    message: errorMessage,
                    id: orderId,
                    method,
                }, null,
                this.loggerContext,
            );

            throw new ReceiptAlreadyExistsError(errorMessage);
        }

        let order: Order;
        try {
            order = await this.orderRepository.findOneOrFail({
                id: orderId,
                cashierId: employeeId,
            });

            this.logger.log({
                    message: 'Got order from database',
                    order,
                    method,
                }, this.loggerContext,
            );

        } catch (e) {
            const errorMessage = `Could not find order with id: ${orderId}.`;

            this.logger.error({
                    message: errorMessage + `Error: ${e.message}`,
                    id: orderId,
                    method,
                },
                e.stack,
                this.loggerContext,
            );
            throw new OrderNotFoundError(errorMessage);
        }

        let newReceipt: Receipt;
        try {
            newReceipt = this.receiptRepository.create(
                this.buildReceiptFromOrder(order),
            );

            this.logger.log(newReceipt);
            return this.receiptRepository.save(newReceipt);
        } catch (e) {
            const errorMessage = 'Could not save receipt to database.';

            this.logger.error({
                    message: errorMessage + ` Error: ${e.message}`,
                    receipt: newReceipt,
                    method,
                }, e.stack,
                this.loggerContext,
            );

            throw new CouldNotCreateReceiptError(errorMessage);
        }
    }

    private buildReceiptFromOrder(order: Order): Receipt {
        const method = 'buildReceiptFromOrder';
        const { id, total, discount, createdAt, product } = order;
        const receipt = {
            orderId: id,
            total,
            discount,
            product,
            orderCreatedAt: createdAt,
        } as Receipt;

        this.logger.log({
                message: 'Built receipt from order',
                receipt,
                method,
            },
            this.loggerContext,
        );

        return receipt;
    }
}
