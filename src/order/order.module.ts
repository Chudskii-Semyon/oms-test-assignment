import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { orderProviders } from './providers/order.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
    ],
    controllers: [OrderController],
    providers: [...orderProviders],
})
export class OrderModule {
}
