import {NestFactory} from '@nestjs/core';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {ValidationPipe, Logger} from '@nestjs/common';
import {AppModule} from './app.module';

async function bootstrap() {
  const logger = new Logger('NotificationsService');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue:
          process.env.RABBITMQ_NOTIFICATIONS_QUEUE || 'notifications_queue',
        queueOptions: {
          durable: true,
        },
        noAck: false,
        prefetchCount: 10,
      },
    },
  );

  const eventService =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue: process.env.RABBITMQ_TASK_EVENTS_QUEUE || 'task_events_queue',
        queueOptions: {
          durable: true,
        },
        noAck: false,
        prefetchCount: 10,
      },
    });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  eventService.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  await eventService.listen();

  logger.log(`Notifications Service is listening on RabbitMQ`);
  logger.log(
    `Notifications Queue: ${process.env.RABBITMQ_NOTIFICATIONS_QUEUE}`,
  );
  logger.log(`Task Events Queue: ${process.env.RABBITMQ_TASK_EVENTS_QUEUE}`);
}

bootstrap();
