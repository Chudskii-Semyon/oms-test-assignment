import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LoggerService } from '../../logger/logger.service';
import { CreateReceiptDto } from './DTOs/create-receipt.dto';
import { Receipt } from '../../entities/receipt.entity';
import { ReceiptService } from './receipt.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EmployeeRoleEnum } from '../../enums/employee-role.enum';
import { Employee } from '../../entities/employee.entity';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

const { CASHIER } = EmployeeRoleEnum;

@ApiTags('Receipts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders/:orderId/receipts')
export class ReceiptController {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        private readonly receiptService: ReceiptService,
    ) {
    }

    @ApiOperation({
        description: 'Endpoint for order creation. Only employee with role CASHIER' +
            ' and who created order with provided id have access to this endpoint',
    })
    @ApiResponse({
        status: 403,
        description: `May occur if employee's role is not CASHIER or order was not created by this employee`,
    })
    @Post()
    @Roles(CASHIER)
    public async createReceipt(@Param() createReceiptInput: CreateReceiptDto, @Req() req: Request): Promise<Receipt> {
        const method = 'createReceipt';
        this.logger.log({
                message: 'Proceed createReceipt endpoint',
                query: createReceiptInput,
                employee: req.user,
                method,
            },
            this.loggerContext,
        );

        const { id } = req.user as Employee;
        return this.receiptService.createReceipt(createReceiptInput, id);
    }
}
