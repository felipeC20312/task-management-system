import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {CommentsController} from './comments.controller';
import {CommentsService} from './comments.service';
import {Comment} from './entities/comment.entity';
import {Task} from '../tasks/entities/task.entity';
import {TaskHistory} from '../tasks/entities/task-history.entity';
import {TaskEventsPublisher} from '../events/publishers/task-events.publisher';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Task, TaskHistory]),
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('rabbitmq.url')],
            queue: configService.get('rabbitmq.eventsExchange'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, TaskEventsPublisher],
})
export class CommentsModule {}
