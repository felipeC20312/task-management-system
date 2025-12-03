import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TasksController} from './tasks.controller';
import {TasksService} from './tasks.service';
import {TaskEventsPublisher} from '../events/publishers/task-events.publisher';

import {Task, TaskAssignee, TaskHistory} from '@monorepo/common-types';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskAssignee, TaskHistory]),
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const url = configService.get<string>('rabbitmq.url');
          const queue = configService.get<string>('rabbitmq.eventsExchange');

          if (!url || !queue) {
            throw new Error('RabbitMQ configuration is missing');
          }

          return {
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue,
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
  providers: [TasksService, TaskEventsPublisher],
  exports: [TasksService],
})
export class TasksModule {}
