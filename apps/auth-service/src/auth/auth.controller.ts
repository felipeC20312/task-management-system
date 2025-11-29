import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {AuthService} from './auth.service';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd: 'register'})
  async register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern({cmd: 'login'})
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern({cm: 'refresh'})
  async refresh(@Payload() data: {refreshToken: string}) {
    return this.authService.refresh(data.refreshToken);
  }
  @MessagePattern({cmd: 'validate-user'})
  async validateUser(@Payload() data: {userId: string}) {
    return this.authService.validateUser(data.userId);
  }
}
