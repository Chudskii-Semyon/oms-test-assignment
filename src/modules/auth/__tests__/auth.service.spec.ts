import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { ConfigModule } from '../../../config/config.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../../entities/employee.entity';
import { JwtModule } from '@nestjs/jwt';
import { IConfigSchema } from '../../../config/schema.interface';
import { CONFIG_TOKEN } from '../../../config/config.constants';
import { AuthController } from '../auth.controller';
import { LoggerService } from '../../../logger/logger.service';
import { EMPLOYEE_REPOSITORY_TOKEN } from '../../employee/constants/employee.constant';
import { mockEmployeeRepository } from '../../../__tests__/mocks/employee-repository.mock';
import { JWT_MODULE_TOKEN } from '../constants/auth.constants';
import { LoginDto } from '../DTOs/login.dto';
import { mockEmployee } from '../../../__tests__/mocks/employee.mock';
import { hash } from 'bcrypt';
import { INVALID_EMAIL_OR_PASSWORD_ERROR } from '../../../errors/InvalidEmailOrPasswordError';

describe('AuthService', () => {
    let service: AuthService;

    const mockToken = 'mock generated token';
    const mockJwtModule = {
        sign: jest.fn().mockReturnValue(mockToken),
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
            .overrideProvider(JWT_MODULE_TOKEN)
            .useValue(mockJwtModule)
            .overrideProvider(EMPLOYEE_REPOSITORY_TOKEN)
            .useValue(mockEmployeeRepository)
            .compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        const { email, password } = mockEmployee;
        const args: LoginDto = { email, password };

        it('should return token', async () => {
            const hashedPassword = await hash(mockEmployee.password, 10);
            const mockEmployeeWithHashedPassword = {
                ...mockEmployee,
                password: hashedPassword,
            };

            const mockEmployeeRepositorySpy = jest.spyOn(mockEmployeeRepository, 'findOneOrFail')
                .mockReturnValue(mockEmployeeWithHashedPassword);

            await service.login({ email, password: 'mock password' });

            expect(mockEmployeeRepositorySpy).toBeCalledWith({ email });
        });

        it('should throw INVALID_EMAIL_OR_PASSWORD_ERROR if employee was not found', async () => {
            jest.spyOn(mockEmployeeRepository, 'findOneOrFail')
                .mockImplementation(() => {
                    throw new Error();
                });

            try {
                await service.login({ email, password: 'mock password' });

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(INVALID_EMAIL_OR_PASSWORD_ERROR);
            }
        });

        it('should throw INVALID_EMAIL_OR_PASSWORD_ERROR if passwords are dont match', async () => {
            jest.spyOn(mockEmployeeRepository, 'findOneOrFail');

            try {
                await service.login({ email, password: 'mock password' });

                fail('did not throw expected error');
            } catch (e) {
                expect(e.response.status).toBe(INVALID_EMAIL_OR_PASSWORD_ERROR);
            }
        });
    });

});
