import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TasksController} from './tasks.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TASKS_SERVICE',
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
  controllers: [TasksController],
})
export class TasksModule {}
