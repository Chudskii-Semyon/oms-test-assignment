import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { ConfigModule } from '../../../config/config.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../../entities/employee.entity';
import { JwtModule } from '@nestjs/jwt';
import { IConfigSchema } from '../../../config/schema.interface';
import { CONFIG_TOKEN } from '../../../config/config.constants';
import { AuthService } from '../auth.service';
import { LoggerService } from '../../../logger/logger.service';
import { EMPLOYEE_REPOSITORY_TOKEN } from '../../employee/constants/employee.constant';
import { mockEmployeeRepository } from '../../../__tests__/mocks/employee-repository.mock';
import { mockEmployee } from '../../../__tests__/mocks/employee.mock';
import { LoginDto } from '../DTOs/login.dto';
import { AuthDto } from '../DTOs/auth.dto';

describe('Auth Controller', () => {
    let controller: AuthController;

    const mockAuthData: AuthDto = { token: 'mock token' };
    const mockAuthService = {
        login: jest.fn().mockReturnValue(mockAuthData),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
            controllers: [AuthController],
            providers: [AuthService, LoggerService],
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .overrideProvider(EMPLOYEE_REPOSITORY_TOKEN)
            .useValue(mockEmployeeRepository)
            .compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        const { email, password } = mockEmployee;
        const args: LoginDto = { email, password };

        it('should return token', async () => {
            const mockAuthServiceSpy = jest.spyOn(mockAuthService, 'login');

            const result = await controller.login(args);

            expect(mockAuthServiceSpy).toBeCalledWith(args);
            expect(result).toEqual(mockAuthData);
        });
    });
});
