import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './modules/order/order.module';
import { LoggerModule } from './logger/logger.module';
import { Connection } from 'typeorm';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeeModule } from './modules/employee/employee.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({}),
        ConfigModule,
        OrderModule,
        LoggerModule,
        AuthModule,
        EmployeeModule,
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
