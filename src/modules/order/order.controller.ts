import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateOrderDto } from './DTOs/create-order.dto';
import { LoggerService } from '../../logger/logger.service';
import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmployeeRoleEnum } from '../../enums/employee-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetOrdersDto } from './DTOs/get-orders.dto';
import { GetOrderDto } from './DTOs/get-order.dto';
import { Employee } from '../../entities/employee.entity';
import { UpdateOrderStatusDto } from './DTOs/update-order-status.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

const { CASHIER, ACCOUNTANT, SHOP_ASSISTANT } = EmployeeRoleEnum;

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        private readonly orderService: OrderService,
    ) {
    }

    @ApiOperation({
        description: 'Endpoint to get orders for specific span of time. ' +
            'Only employee with role ACCOUNTANT have access to this endpoint',
    })
    @Get()
    @Roles(ACCOUNTANT)
    public async getOrders(@Query() dateRange: GetOrdersDto): Promise<Order[]> {
        this.logger.log({
                message: 'proceed get orders endpoint',
                query: dateRange,
                method: 'getOrders',
            },
            this.loggerContext,
        );

        return this.orderService.getOrders(dateRange);
    }

    @ApiOperation({
        description: 'Endpoint to get order. Only employee with role' +
            ' ACCOUNTANT/SHOP_ASSISTANT have access to this endpoint',
    })
    @Get(':orderId')
    @Roles(SHOP_ASSISTANT, ACCOUNTANT)
    public async getOrder(@Param() getOrderInput: GetOrderDto): Promise<Order> {
        const method = 'getOrder';
        this.logger.log({
                message: 'proceed get order endpoint',
                params: getOrderInput,
                method,
            },
            this.loggerContext,
        );

        return this.orderService.getOrder(getOrderInput);
    }

    @ApiOperation({
        description: 'Endpoint for order creation. Only employee with role ' +
            'CASHIER have access to this endpoint',
    })
    @Post()
    @Roles(CASHIER)
    public async createOrder(@Body() createOrderInput: CreateOrderDto, @Req() req: Request): Promise<Order> {
        const method = 'createOrder';
        const { id } = req.user as Employee;

        this.logger.log({
                message: 'proceed createOrder',
                body: createOrderInput,
                employeeId: id,
                method,
            }, this.loggerContext,
        );

        return await this.orderService.createOrder(createOrderInput, id);
    }

    @ApiOperation({
        description: 'Endpoint to update order status. Only employee with role ' +
            'SHOP_ASSISTANT / CASHIER have access to this endpoint. SHOP_ASSISTANT' +
            ' only can update order status to COMPLETED while CASHIER to PAID',
    })
    @ApiResponse({
        status: 403,
        description: 'May occur if employee dont have access to this source or specific action',
    })
    @Put(':orderId/status')
    @Roles(SHOP_ASSISTANT, CASHIER)
    public async updateOrderStatus(
        @Body() updateOrderStatusInput: UpdateOrderStatusDto,
        @Req() req: Request,
    ): Promise<Order> {
        const method = 'updateOrderStatus';

        const employee = req.user as Employee;

        this.logger.log({
                message: 'Proceed updateOrderStatus endpoint',
                body: updateOrderStatusInput,
                employee,
                method,
            },
            this.loggerContext,
        );

        return this.orderService.updateOrderStatus(updateOrderStatusInput, employee);
    }
}
