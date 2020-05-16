import { OrderService } from '../order.service';
import { LoggerService } from '../../../logger/logger.service';
import { Provider } from '@nestjs/common';
import {
    UpdateOrderContext,
    UpdateOrderStatusToCompletedStrategy,
    UpdateOrderStatusToPaidStrategy,
} from '../strategies/update-order.strategy';

export const orderProviders: Provider[] = [
    OrderService,
    LoggerService,
    UpdateOrderContext,
    UpdateOrderStatusToCompletedStrategy,
    UpdateOrderStatusToPaidStrategy,
];
