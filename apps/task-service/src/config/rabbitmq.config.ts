import {registerAs} from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
  queue: process.env.RABBITMQ_TASKS_QUEUE || 'tasks_queue',
  eventsExchange: process.env.RABBITMQ_EVENTS_EXCHANGE || 'task_events',
}));
