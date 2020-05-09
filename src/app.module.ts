import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './modules/order/order.module';
import { LoggerModule } from './logger/logger.module';
import { Connection } from 'typeorm';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ProductModule } from './modules/product/product.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({}),
        ConfigModule,
        OrderModule,
        LoggerModule,
        AuthModule,
        ReceiptModule,
        EmployeeModule,
        ProductModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
    ],
})
export class AppModule {
    constructor(
        private readonly connection: Connection,
    ) {
    }
}
