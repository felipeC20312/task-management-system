import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
  queues: {
    auth: process.env.AUTH_QUEUE || 'auth_queue',
    tasks: process.env.TASKS_QUEUE || 'tasks_queue',
    notifications: process.env.NOTIFICATIONS_QUEUE || 'notifications_queue',
  },
}));
