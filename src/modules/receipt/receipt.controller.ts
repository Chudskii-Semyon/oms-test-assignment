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

const { CASHIER } = EmployeeRoleEnum;

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders/:orderId/receipts')
export class ReceiptController {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        private readonly receiptService: ReceiptService,
    ) {
    }

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
