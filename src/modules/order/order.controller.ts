import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './DTOs/create-order.dto';
import { LoggerService } from '../../logger/logger.service';
import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmployeeRoleEnum } from '../../enums/employee-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

const { CASHIER } = EmployeeRoleEnum;

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        private readonly orderService: OrderService,
    ) {
    }

    @Post()
    @Roles(CASHIER)
    public async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        this.logger.log({
                message: 'proceed createOrder',
                createOrderDto,
                method: 'createOrder',
            }, this.loggerContext
        );

        return await this.orderService.createOrder(createOrderDto);
    }
}
