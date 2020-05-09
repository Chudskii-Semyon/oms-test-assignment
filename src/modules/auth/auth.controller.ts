import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './DTOs/login.dto';
import { AuthDto } from './DTOs/auth.dto';
import { LoggerService } from '../../logger/logger.service';

@Controller('auth')
export class AuthController {
    private readonly loggerContext = this.constructor.name;

    constructor(
        private readonly authService: AuthService,
        private readonly logger: LoggerService,
    ) {
    }

    @Post('login')
    public async login(@Body() loginInput: LoginDto): Promise<AuthDto> {
        this.logger.log({
                message: 'Proceed login',
                loginInput,
                method: 'login',
            }, this.loggerContext,
        );
        return this.authService.login(loginInput);
    }
}
