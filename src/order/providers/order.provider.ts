import { OrderService } from '../order.service';
import { LoggerService } from '../../logger/logger.service';

export const orderProviders = [
    OrderService,
    LoggerService,
    // {
    //     provide: ORDER_REPOSITORY_TOKEN,
    //     useFactory: (connection: Connection) => connection.getRepository(Order),
    // inject: ['DATABASE_CONNECTION'],
    // },
];
