import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { LoggerService } from '../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { ConfigModule } from '../../config/config.module';
import { Receipt } from '../../entities/receipt.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Receipt]),
        ConfigModule,
    ],
    controllers: [ReceiptController],
    providers: [ReceiptService, LoggerService],
})
export class ReceiptModule {
}
