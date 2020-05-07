import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './DTOs/create-order.dto';
import { LoggerService } from '../../logger/logger.service';
import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';

@Controller('order')
export class OrderController {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        private readonly orderService: OrderService,
    ) {
    }

    @Post()
    public async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        this.logger.log({
            message: 'proceed createOrder',
            createOrderDto,
            method: 'createOrder',
        }, this.loggerContext);

        return await this.orderService.createOrder(createOrderDto);
    }
}
