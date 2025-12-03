import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {CommentsController} from './comments.controller';
import {CommentsService} from './comments.service';
import {TaskEventsPublisher} from '../events/publishers/task-events.publisher';

import {Task, TaskHistory} from '@monorepo/common-types';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Task, TaskHistory]),
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const urls = [configService.get('rabbitmq.url')];
          const queue = configService.get('rabbitmq.eventsExchange');

          if (!urls || !queue) {
            throw new Error('rabbitmq config not found.');
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
  controllers: [CommentsController],
  providers: [CommentsService, TaskEventsPublisher],
})
export class CommentsModule {}
