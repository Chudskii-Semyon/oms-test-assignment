import { Module } from '@nestjs/common';
import * as convict from 'convict';
import { schema } from './schema';
import {
    CONFIG_SCHEMA_TOKEN,
    CONFIG_TOKEN,
    CONVICT_MODULE_TOKEN,
} from './config.constants';
import { configProvider } from './config.provider';
import { LoggerService } from '../logger/logger.service';

@Module({
    providers: [
        {
            provide: CONVICT_MODULE_TOKEN,
            useValue: convict,
        },
        {
            provide: CONFIG_SCHEMA_TOKEN,
            useValue: schema,
        },
        configProvider,
        LoggerService,
    ],
    exports: [CONFIG_TOKEN],
})
export class ConfigModule {
}
