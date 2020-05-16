import { EmployeeRoleEnum } from '../../../enums/employee-role.enum';
import { OrderStatusEnum } from '../../../enums/order-status.enum';
import { Order } from '../../../entities/order.entity';
import { ForbiddenResourceError } from '../../../errors/ForbiddenResourceError';
import { Employee } from '../../../entities/employee.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../../../logger/logger.service';
import { CouldNotUpdateOrderError } from '../../../errors/CouldNotUpdateOrderError';
import { OrderAlreadyCompletedError } from '../../../errors/OrderAlreadyCompletedError';
import { OrderNotCompletedError } from '../../../errors/OrderNotCompletedError';
import { UpdateOrderStatusDto } from '../DTOs/update-order-status.dto';

const { CASHIER, SHOP_ASSISTANT } = EmployeeRoleEnum;
const { COMPLETED, CREATED, PAID } = OrderStatusEnum;

@Injectable()
export class UpdateOrderContext {
    private readonly loggerContext = this.constructor.name;
    private strategy: UpdateOrderStrategy;

    constructor() {
    }

    public setStrategy<T>(strategy: UpdateOrderStrategy) {
        this.strategy = strategy;
    }

    public checkAccess(orderToUpdate: Order, employee: Employee): boolean {
        return this.strategy.checkAccess(orderToUpdate, employee);
    }

    public async updateOrder(order: Order, employee: Employee, input): Promise<Order> {
        return this.strategy.updateOrder(order, employee, input);
    }
}

interface UpdateOrderStrategy {
    checkAccess(orderToUpdate: Order, employee: Employee): boolean;

    updateOrder(orderToUpdate: Order, employee: Employee, input): Promise<Order>;
}

@Injectable()
// tslint:disable-next-line:max-classes-per-file
export class UpdateOrderStatusToCompletedStrategy implements UpdateOrderStrategy {
    private readonly loggerContext = this.constructor.name;
    private readonly EMPLOYEE_ROLES = [SHOP_ASSISTANT];

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly logger: LoggerService,
    ) {
    }

    public checkAccess(orderToUpdate: Order, employee: Employee): boolean {
        const { role } = employee;
        const hasAccess = this.EMPLOYEE_ROLES.includes(role);

        if (!hasAccess) {
            throw new ForbiddenResourceError();
        }

        if (orderToUpdate.status !== CREATED) {
            this.logger.error({
                    message: 'Order already completed.',
                    statusToUpdate: COMPLETED,
                    orderToUpdate,
                    employee,
                },
                null,
                this.loggerContext,
            );
            throw new OrderAlreadyCompletedError(`order with id: ${orderToUpdate.id} already completed!`);
        }

        return true;
    }

    public async updateOrder(order: Order, employee: Employee, input: UpdateOrderStatusDto): Promise<Order> {
        const method = 'updateOrder';
        const { status } = input;
        try {
            return this.orderRepository.save({
                ...order,
                status,
                shopAssistant: { id: employee.id },
            });
        } catch (e) {
            const errorMessage = `Could not update order with id: ${order.id} to status: ${status}.`;

            this.logger.error({
                    message: errorMessage + ` Error: ${e.message}`,
                    order,
                    employee,
                    statusToUpdate: status,
                    method,
                },
                e.stack,
                this.loggerContext,
            );

            throw new CouldNotUpdateOrderError(errorMessage);
        }
    }
}

@Injectable()
// tslint:disable-next-line:max-classes-per-file
export class UpdateOrderStatusToPaidStrategy implements UpdateOrderStrategy {
    private readonly loggerContext = this.constructor.name;
    private readonly EMPLOYEE_ROLES = [CASHIER];

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly logger: LoggerService,
    ) {
    }

    public checkAccess(orderToUpdate: Order, employee: Employee): boolean {
        this.logger.log(orderToUpdate, this.loggerContext);
        const { role } = employee;
        const hasAccess = this.EMPLOYEE_ROLES.includes(role);

        if (!hasAccess) {
            throw new ForbiddenResourceError();
        }

        if (orderToUpdate.status !== COMPLETED) {
            this.logger.error({
                    message: 'Order is not completed yet!',
                    statusToUpdate: PAID,
                    employee,
                    orderToUpdate,
                },
                null,
                this.loggerContext,
            );
            throw new OrderNotCompletedError(`order with id: ${orderToUpdate.id} is not completed yet!`);
        }

        return true;
    }

    public async updateOrder(order: Order, employee: Employee, input: UpdateOrderStatusDto): Promise<Order> {
        const method = 'updateOrder';
        const { status } = input;
        try {
            return this.orderRepository.save({
                ...order,
                status,
            });
        } catch (e) {
            const errorMessage = `Could not update order with id: ${order.id} to status: ${status}.`;

            this.logger.error({
                    message: errorMessage + ` Error: ${e.message}`,
                    order,
                    employee,
                    statusToUpdate: status,
                    method,
                },
                e.stack,
                this.loggerContext,
            );

            throw new CouldNotUpdateOrderError(errorMessage);
        }
    }
}
