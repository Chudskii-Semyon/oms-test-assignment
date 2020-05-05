import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { CreateOrderDto } from './DTOs/create-order.dto';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {
    }

    public async orderCreate(createOrderDto: CreateOrderDto) {
        this.logger.log({
            message: 'orderCreate',
        }, this.loggerContext);
        const result = await this.orderRepository.find();

        return result;
    }
}
