import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {AuthController} from './auth.controller';
import {JwtStrategy} from './strategies/jwt.strategy';
import {JwtAuthGuard} from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.accessExpiration'),
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const urls = configService.get('rabbitmq.url');
          const queue = configService.get('rabbitmq.queues.auth');

          if (!urls || !queue) {
            const missing: string[] = [];

            if (!urls) missing.push('urls');
            if (!queue) missing.push('queue');

            throw new Error(
              `RabbitMQ configuration is missing: ${missing.join(', ')}`,
            );
          }

          return {
            transport: Transport.RMQ,
            options: {
              urls: urls,
              queue: queue,
              queueOptions: {
                durable: true,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtStrategy, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
