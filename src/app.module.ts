import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { LoggerModule } from './logger/logger.module';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forRoot({}), OrderModule, LoggerModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(
        private readonly connection: Connection,
    ) {
    }
}
