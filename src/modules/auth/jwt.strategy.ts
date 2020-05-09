import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { IConfigSchema } from '../../config/schema.interface';
import { LoggerService } from '../../logger/logger.service';
import { JwtPayloadDto } from './DTOs/jwt-payload.dto';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CONFIG_TOKEN } from '../../config/config.constants';
import { EmployeeNotFoundError } from '../../errors/EmployeeNotFoundError';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly logger: LoggerService,
        @Inject(CONFIG_TOKEN)
        private readonly config: IConfigSchema,
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.auth.secret,
        });
    }

    async validate(payload: JwtPayloadDto): Promise<Employee> {
        let employee: Employee;
        try {
            employee = await this.employeeRepository.findOneOrFail({ id: payload.sub });
        } catch (e) {
            this.logger.error({
                    message: `Could not find employee by id. Error: ${e.message}`,
                    id: payload.sub,
                    method: 'validate',
                },
                e.stack,
                this.loggerContext,
            );
            throw new EmployeeNotFoundError(`Could not find employee with id: ${payload.sub}`);
        }
        return employee;
    }
}
