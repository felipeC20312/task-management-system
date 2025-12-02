import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {ApiTags, ApiOperation, ApiResponse, ApiBody} from '@nestjs/swagger';
import {Public} from './decorators/public.decorator';
import {firstValueFrom, timeout} from 'rxjs';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: 'Register a new user'})
  @ApiBody({type: RegisterDto})
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      properties: {
        accessToken: {type: 'string'},
        refreshToken: {type: 'string'},
        user: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            email: {type: 'string'},
            username: {type: 'string'},
            createdAt: {type: 'string'},
          },
        },
      },
    },
  })
  @ApiResponse({status: 409, description: 'User already exists'})
  async register(@Body() registerDto: RegisterDto) {
    return firstValueFrom(
      this.authClient.send({cmd: 'register'}, registerDto).pipe(timeout(5000)),
    );
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Login with email and password'})
  @ApiBody({type: LoginDto})
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      properties: {
        accessToken: {type: 'string'},
        refreshToken: {type: 'string'},
        user: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            email: {type: 'string'},
            username: {type: 'string'},
            createdAt: {type: 'string'},
          },
        },
      },
    },
  })
  @ApiResponse({status: 401, description: 'Invalid credentials'})
  async login(@Body() loginDto: LoginDto) {
    return firstValueFrom(
      this.authClient.send({cmd: 'login'}, loginDto).pipe(timeout(5000)),
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Refresh access token'})
  @ApiBody({type: String})
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      properties: {
        accessToken: {type: 'string'},
        refreshToken: {type: 'string'},
      },
    },
  })
  @ApiResponse({status: 401, description: 'Invalid refresh token'})
  async refresh(@Body() refreshTokenDto: string) {
    return firstValueFrom(
      this.authClient
        .send({cmd: 'refresh'}, refreshTokenDto)
        .pipe(timeout(5000)),
    );
  }
}
