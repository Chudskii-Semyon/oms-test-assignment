import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { CreateOrderDto } from './DTOs/create-order.dto';
import { Between, Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { OrderStatusEnum } from '../../enums/order-status.enum';
import { CONFIG_TOKEN } from '../../config/config.constants';
import { IConfigSchema } from '../../config/schema.interface';
import { GetOrdersDto } from './DTOs/get-orders.dto';
import { CouldNotGetOrdersError } from '../../errors/CouldNotGetOrdersError';
import { GetOrderDto } from './DTOs/get-order.dto';
import { OrderNotFoundError } from '../../errors/OrderNotFoundError';
import { ProductNotFoundError } from '../../errors/ProductNotFoundError';
import { CouldNotCreateOrderError } from '../../errors/CouldNotCreateOrderError';
import { UpdateOrderStatusDto } from './DTOs/update-order-status.dto';
import { Employee } from '../../entities/employee.entity';
import { EmployeeRoleEnum } from '../../enums/employee-role.enum';
import {
    UpdateOrderContext,
    UpdateOrderStatusToCompletedStrategy,
    UpdateOrderStatusToPaidStrategy,
} from './strategies/update-order.strategy';

const { COMPLETED, PAID, CREATED } = OrderStatusEnum;
const { SHOP_ASSISTANT, CASHIER } = EmployeeRoleEnum;

@Injectable()
export class OrderService {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        // strategy for updating order
        private readonly updateOrderContext: UpdateOrderContext,
        private readonly updateOrderStatusToCompletedStrategy: UpdateOrderStatusToCompletedStrategy,
        private readonly updateOrderStatusToPaidStrategy: UpdateOrderStatusToPaidStrategy,
        @Inject(CONFIG_TOKEN)
        private readonly config: IConfigSchema,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {
    }

    public async getOrder(getOrderInput: GetOrderDto): Promise<Order> {
        const method = 'getOrder';

        const { orderId } = getOrderInput;

        try {
            const order = await this.orderRepository.findOneOrFail(orderId);

            this.logger.log({
                    message: 'Got order from database',
                    order,
                    method,
                }, this.loggerContext,
            );

            return order;
        } catch (e) {
            this.logger.error({
                    message: 'Could not find order by id',
                    id: orderId,
                    method,
                },
                e.stack,
                this.loggerContext,
            );

            throw new OrderNotFoundError(`Could not find order with id: ${orderId}`);
        }
    }

    public async getOrders(dateRange: GetOrdersDto): Promise<Order[]> {
        const method = 'getOrders';

        const { start, end } = dateRange;

        try {
            return this.orderRepository.find({
                createdAt: Between(start, end),
            });
        } catch (e) {
            this.logger.error({
                    message: `Could not get orders from database. Error: ${e.message}`,
                    dateRange,
                    method,
                },
                e.stack,
                this.loggerContext,
            );
            throw new CouldNotGetOrdersError(`
            Could not get orders from database by date range (start: ${start}, end: ${end}).
            `);
        }
    }

    public async createOrder(
        createOrderInput: CreateOrderDto,
        employeeId: number,
    ): Promise<Order> {
        const method = 'createOrder';
        const { productId } = createOrderInput;

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
            throw new ProductNotFoundError(`Product with id ${productId} not found`);
        }

        this.logger.log({
                message: 'got product from database',
                product,
                method,
            },
            this.loggerContext,
        );

        const discount = this.calculateProductDiscount(product);

        let newOrder: Order;
        try {
            newOrder = this.orderRepository.create({
                product,
                discount,
                total: +(product.price - discount).toFixed(2),
                cashier: { id: employeeId },
                status: OrderStatusEnum.CREATED,
            });

            this.logger.log({
                message: 'storing new order in database',
                newOrder,
                method,
            });

            // I think it will be a good idea if there will be some event emitter / socket
            // in order to shop assistant could see order creation in real time

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
            throw new CouldNotCreateOrderError(`Could not create order. Error: ${e.message}`);
        }
    }

    public async updateOrderStatus(
        updateOrderStatusInput: UpdateOrderStatusDto,
        employee: Employee,
    ): Promise<Order> {
        const method = 'updateOrderStatus';
        const { status, orderId } = updateOrderStatusInput;

        let order: Order;
        try {
            order = await this.orderRepository.findOneOrFail(orderId);
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

        if (status === COMPLETED) {
            this.logger.log({
                    message: 'Updating order status to COMPLETED using updateOrderStatusToCompletedStrategy',
                    order,
                    method,
                },
                this.loggerContext,
            );

            this.updateOrderContext.setStrategy(this.updateOrderStatusToCompletedStrategy);

            this.updateOrderContext.checkAccess(order, employee);
            return this.updateOrderContext.updateOrder(order, employee, updateOrderStatusInput);
        }

        if (status === PAID) {
            this.logger.log({
                    message: 'Updating order status to PAID using updateOrderStatusToPaidStrategy',
                    order,
                    method,
                },
                this.loggerContext,
            );

            this.updateOrderContext.setStrategy(this.updateOrderStatusToPaidStrategy);

            this.updateOrderContext.checkAccess(order, employee);
            return this.updateOrderContext.updateOrder(order, employee, updateOrderStatusInput);
        }
    }

    private calculateProductDiscount(product: Product): number {
        const method = 'calculateProductDiscount';
        this.logger.log({
                message: 'Start calculating product discount',
                product,
                method,
            },
            this.loggerContext,
        );
        const { numberOfMonths, percent } = this.config.discount;
        const productCreatedDate = product.createdAt;

        const currentDate = new Date();
        const monthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - numberOfMonths));

        if (productCreatedDate <= monthAgo) {
            return +(product.price / 100 * percent).toFixed(2);
        }

        return 0;
    }
}
