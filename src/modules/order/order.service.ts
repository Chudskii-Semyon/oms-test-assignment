import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { CreateOrderDto } from './DTOs/create-order.dto';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { Employee } from '../../entities/employee.entity';
import { OrderStatusEnum } from '../../enums/order-status.enum';
import { CONFIG_TOKEN } from '../../config/config.constants';
import { IConfigSchema } from '../../config/schema.interface';

@Injectable()
export class OrderService {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        @Inject(CONFIG_TOKEN)
        private readonly config: IConfigSchema,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {
    }

    public async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        const method = 'createOrder';
        const { productId } = createOrderDto;

        let product: Product;

        try {
            product = await this.productRepository.findOneOrFail({
                id: productId,
            });
        } catch (e) {
            this.logger.error({
                    message: `Product not found. Error: ${e.message}`,
                    productId,
                    method,
                },
                e.stack,
                this.loggerContext,
            );
            throw new HttpException(
                `Product with id ${productId} not found`,
                HttpStatus.BAD_REQUEST,
            );
        }

        this.logger.log({
            message: 'got product from database',
            product,
            method,
        }, this.loggerContext);

        const discount = this.calculateProductDiscount(product);

        let newOrder: Order;
        try {
            newOrder = this.orderRepository.create({
                product,
                discount,
                total: product.price - discount,
                cashier: { id: 1 } as Employee,
                status: OrderStatusEnum.CREATED,
            });

            this.logger.log({
                message: 'storing new order in database',
                newOrder,
                method,
            });

            return await this.orderRepository.save(newOrder);
        } catch (e) {
            this.logger.error({
                    message: 'Could not create order.',
                    newOrder,
                    method,
                },
                e.stack,
                this.loggerContext,
            );
            throw new HttpException(
                `Could not create order. Error: ${e.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private calculateProductDiscount(product: Product): number {
        const { numberOfMonths, percent } = this.config.discount;
        const productCreatedDate = product.createdAt;

        const currentDate = new Date();
        const monthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - numberOfMonths));

        if (productCreatedDate <= monthAgo) {
            return product.price / 100 * percent;
        }

        return 0;
    }
}
