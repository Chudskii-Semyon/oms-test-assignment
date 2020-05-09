import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { IConfigSchema } from '../../config/schema.interface';
import { CONFIG_TOKEN } from '../../config/config.constants';
import { ConfigModule } from '../../config/config.module';
import { LoggerService } from '../../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../entities/employee.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        TypeOrmModule.forFeature([Employee]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: IConfigSchema) => {
                return {
                    secret: config.auth.secret,
                    signOptions: { expiresIn: config.auth.expirationTimeSeconds },
                };
            },
            inject: [CONFIG_TOKEN],
        }),
    ],
    providers: [AuthService, LoggerService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {
}
