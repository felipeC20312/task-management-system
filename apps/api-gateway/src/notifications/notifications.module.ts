import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {NotificationsController} from './notifications.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const urls = configService.get('rabbitmq.url');
          const queue = configService.get('rabbitmq.queues.tasks');

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
  controllers: [NotificationsController],
})
export class NotificationsModule {}
