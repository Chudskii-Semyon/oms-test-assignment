import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './DTOs/create-order.dto';
import { LoggerService } from '../logger/logger.service';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        private readonly orderService: OrderService,
    ) {
    }

    @Post()
    public async createOrder(@Body() createOrderDto: CreateOrderDto) {
        this.logger.log({
            message: 'proceed createOrder',
            createOrderDto,
            method: 'createOrder',
        }, this.loggerContext);

        return await this.orderService.orderCreate(createOrderDto);
    }
}
