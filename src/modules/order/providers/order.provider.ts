import { OrderService } from '../order.service';
import { LoggerService } from '../../../logger/logger.service';
import { Provider } from '@nestjs/common';

export const orderProviders: Provider[] = [
    OrderService,
    LoggerService,
];
