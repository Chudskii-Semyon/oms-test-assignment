import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../../entities/employee.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './DTOs/login.dto';
import { compare } from 'bcrypt';
import { CONFIG_TOKEN } from '../../config/config.constants';
import { IConfigSchema } from '../../config/schema.interface';
import { InvalidEmailOrPasswordError } from '../../errors/InvalidEmailOrPasswordError';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './DTOs/auth.dto';

@Injectable()
export class AuthService {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        private readonly jwtService: JwtService,
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
        @Inject(CONFIG_TOKEN)
        private readonly config: IConfigSchema,
    ) {
    }

    public async login(loginInput: LoginDto): Promise<AuthDto> {
        const method = 'login';
        const { password, email } = loginInput;

        let employee: Employee;
        try {
            employee = await this.employeeRepository.findOneOrFail({ email });

            this.logger.log({
                    message: 'got employee from database',
                    employee,
                    method,
                },
                this.loggerContext,
            );

            const isPasswordMatches = await compare(password, employee.password);

            if (!isPasswordMatches) {
                throw new InvalidEmailOrPasswordError();
            }
        } catch (e) {
            this.logger.error({
                    message: `Email or password is invalid. Error: ${e.message}`,
                    method,
                },
                e.stack,
                this.loggerContext,
            );

            throw new InvalidEmailOrPasswordError();
        }

        const token = this.jwtService.sign({ sub: employee.id });
        return { token };
    }
}
