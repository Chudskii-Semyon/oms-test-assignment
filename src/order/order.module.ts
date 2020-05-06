import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { orderProviders } from './providers/order.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { ConfigModule } from '../config/config.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Product]),
        ConfigModule,
    ],
    controllers: [OrderController],
    providers: [...orderProviders],
})
export class OrderModule {
}
