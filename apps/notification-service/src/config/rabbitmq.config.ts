import {registerAs} from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
  notificationsQueue:
    process.env.RABBITMQ_NOTIFICATIONS_QUEUE || 'notifications_queue',
  taskEventsQueue:
    process.env.RABBITMQ_TASK_EVENTS_QUEUE || 'task_events_queue',
}));
